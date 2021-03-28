import Module from '../../models/Module';
import { LayerType } from '../../modules/ui-manager/models/LayerType';
import UIManager from '../../modules/ui-manager/UIManager';
import ActionsLayer from '../../modules/ui-manager/views/ActionsLayer';
import Game from '../Game';
import MultifunctionalListLayer, {
  MultifunctionalListItem,
} from '../../modules/ui-manager/views/MultifunctionalListLayer';
import Storage from '../../modules/storage/Storage';
import { CustomLevel } from '../../modules/storage/models/CustomLevel';
import GameRunner from '../../modules/game-runner/GameRunner';
import Level from '../../models/Level';
import RunnerLayer from '../../modules/ui-manager/views/RunnerLayer';
import { v4 as uuid } from 'uuid';
import SavedCustomGame from '../../modules/storage/models/SavedCustomGame';
import EditorLayer from '../../modules/ui-manager/views/EditorLayer';

// Images
import Play from '%assets%/icons/play.svg';
import Restart from '%assets%/icons/arrow-counterclockwise.svg';
import Plus from '%assets%/icons/patch-plus.svg';
import Previous from '%assets%/icons/arrow-left.svg';
import Trash from '%assets%/icons/trash.svg';
import Pen from '%assets%/icons/pen.svg';
import Close from '%assets%/icons/close.svg';
import promptFilled from '../../utils/promptFilled';

export default class ModuleThree implements Module {
  // User interface
  private readonly uimanager: UIManager;

  private readonly levelList = new MultifunctionalListLayer('Levels');
  private readonly gamesList = new MultifunctionalListLayer('Saved games');

  constructor(private readonly gameRunner: GameRunner, private readonly game: Game) {
    this.uimanager = game.uimanager;
  }

  /** Indicates what list should be shown at the moment */
  private games = false;

  start(): void {
    this.prepareUI();

    this.games = false;
    this.openMenu();
  }

  /** Prepares user interface; ie. it creates custom layers etc. */
  private prepareUI(): void {
    // Set Editor actions
    (this.uimanager.layer(LayerType.Editor) as EditorLayer).set({
      playHandler: level => this.openRunner(level, true),
      saveHandler: level => this.saveLevel(level),
      backToMenuHandler: level => {
        // If the player has opened an existing level, save their work
        // Also if the player has a new level opened, ask for saving and then save it
        if (!(this.saved || confirm('Do you want to save your work?')) || this.saveLevel(level)) {
          this.openMenu();
        }
      },
    });

    // Create custom layers
    this.uimanager.create(this.levelList, LayerType.Custom0);
    this.uimanager.create(this.gamesList, LayerType.Custom1);
  }

  private saved?: { id: string; name: string };

  /** Saves given level to localstorage */
  private saveLevel(level: Level): boolean {
    const id = this.saved?.id;
    let name = this.saved?.name;

    // Ask for name for current save
    // if it was not provided, then return, that the function didn't succeed
    if (!name) {
      const prompt = promptFilled('Enter a name for this level');
      if (prompt === null) return false;
      name = prompt;
    }

    const save: CustomLevel = { id: id ?? uuid(), name: name ?? prompt!, ...level };
    Storage.append('levels', save);

    this.saved = save;

    return true;
  }

  /** Opens a menu with created levels / saved games */
  private openMenu(): void {
    // Set items in action buttons
    (this.uimanager.layer(LayerType.Actions) as ActionsLayer).set({
      onclick: index => {
        if (index === 0) {
          this.games = !this.games;
          this.openMenu();
        } else {
          this.game.showMenu();
        }
      },
      items: [
        this.games ? { src: Pen, title: 'levels' } : { src: Play, title: 'saved games' },
        { src: Restart, title: 'back to menu' },
      ],
    });

    // Update lists
    if (this.games) this.updateGamesList();
    else this.updateLevelsList();

    // Show propper layers
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Actions, this.games ? LayerType.Custom1 : LayerType.Custom0);
  }

  /** Updates the list of created levels */
  private updateLevelsList(): void {
    const items: MultifunctionalListItem[] = [];

    // Create the highlighted 'Create new level' button
    items.push({
      title: 'Create new level',
      onclick: () => this.openEditor(),
      actions: [{ src: Plus, title: 'Start new game', onclick: () => this.openEditor() }],
      highlighted: true,
    });

    const levels = Storage.get<CustomLevel>('levels').all;

    // Open game window
    const play = (id: string) => {
      const level = Storage.get<CustomLevel>('levels').findOne(id);
      if (level) this.openRunner(level);
    };

    // Remove level from localStorage
    const remove = (id: string, name: string) => {
      if (!confirm(`Delete '${name}'?`)) return;

      Storage.remove('levels', id);
      this.updateLevelsList();
    };

    // Create a list with created levels
    levels.forEach(level => {
      const item: MultifunctionalListItem = {
        title: level.name,
        actions: [
          { src: Play, title: 'Play', onclick: () => play(level.id) },
          { src: Pen, title: 'Edit', onclick: () => this.openEditor(level) },
          { src: Trash, title: 'Remove', onclick: () => remove(level.id, level.name) },
        ],
        onclick: () => this.openEditor(level),
      };

      items.push(item);
    });

    this.levelList.set(items);
  }

  /** Updates the list of unfinished games */
  private updateGamesList(): void {
    const items: MultifunctionalListItem[] = [];
    const games = Storage.get<SavedCustomGame>('custom-games').all;

    const play = (id: string) => {
      const game = games.find(game => game.id === id);
      this.openRunner(game!);
    };

    games.forEach(game =>
      items.push({
        title: game.name,
        actions: [{ src: Play, title: 'Play', onclick: () => play(game.id) }],
        onclick: () => play(game.id),
      })
    );

    this.gamesList.set(items);
  }

  /** Opens the editor for */
  private openEditor(level?: CustomLevel): void {
    this.saved = level;

    const editor = (this.uimanager.layer(LayerType.Editor) as EditorLayer).editor;
    editor.clear(); // Clear the editor
    if (level) editor.loadLevel(level);

    // Show editor
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Editor);
  }

  /** Opens the game runner */
  private openRunner(game: Level | SavedCustomGame, inEditor: boolean = false): void {
    // Hide all layers except GameRunner
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Runner);

    const runner = this.uimanager.layer(LayerType.Runner) as RunnerLayer;

    runner.resize(); // Resize the canvas to match browser window size
    runner.hideOverlay(); // Hide pause screen

    this.updateUI(inEditor, game);

    // Set level
    this.gameRunner.setLevel('level' in game ? game.level : game);

    // Set layout and stats if available (if type of the object is SavedCustomGame - not Level)
    if ('layout' in game) {
      this.gameRunner.setLayout(game.layout);
      this.gameRunner.stats = game.stats;
    }
  }

  /**
   * Updates actions and control buttons
   * @param inEditor Determines if the level was started from the menu, or the editor
   */
  private updateUI(inEditor: boolean, game: Level | SavedCustomGame) {
    const actions = this.uimanager.layer(LayerType.Actions) as ActionsLayer;
    const runner = this.uimanager.layer(LayerType.Runner) as RunnerLayer;

    let saved = 'level' in game ? game : undefined;

    const save = () => {
      const id = this.saved?.id;
      let name = this.saved?.name;

      // Ask for name for current save
      // if it was not provided, then return, that the function didn't succeed
      if (!name) {
        const prompt = promptFilled('Enter a name for this game');
        if (prompt === null) return false;
        name = prompt;
      }

      // Get level
      const level = 'level' in game ? game.level : game;

      // Save current game
      const save: SavedCustomGame = {
        id: id!,
        name: name!,
        level,
        layout: this.gameRunner.getLayout(),
        stats: this.gameRunner.stats,
      };

      saved = save;
      Storage.append('custom-games', save);

      return true;
    };

    if (inEditor) {
      actions.set({
        items: [{ src: Previous, title: 'back to editor' }],
        onclick: () => {
          this.uimanager.hideAll();
          this.uimanager.show(LayerType.Editor);
        },
      });

      runner.set({
        items: [{ src: Restart, title: 'restart' }],
        onclick: () => {
          this.gameRunner.reset();
          runner.hideOverlay();
        },
      });

      return;
    }

    // If the level was run from the menu
    // Set action buttons contents
    actions.set({
      items: [{ src: Previous, title: 'back to menu' }],
      onclick: () => {
        // If the game has been just finished, remove it from the local storage
        if (this.gameRunner.finished) {
          if (saved) Storage.remove('custom-games', saved.id);
          this.openMenu();
          return;
        }

        // If the game has not been finished yet, save its progress
        if (!confirm('Do you want to save your progress?') || save()) {
          this.openMenu();
        }
      },
    });

    // Set control buttons in runner
    runner.set({
      items: [
        { src: Close, title: 'discard' },
        { src: Restart, title: 'restart' },
      ],
      onclick: (index: number) => {
        if (index === 1) {
          // Restart current level
          this.gameRunner.reset();
          runner.hideOverlay();
          return;
        }

        // If current level was finished
        // the player wants their progress to be lost,
        // remove saved game from the localstorage and open the menu
        if (this.gameRunner.finished || confirm('Your progress will be lost. Continue?')) {
          if (saved) Storage.remove('custom-games', saved.id);
          this.openMenu();
        }
      },
    });
  }
}
