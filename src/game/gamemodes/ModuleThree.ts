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

// Images
import Play from '%assets%/icons/play.svg';
import Restart from '%assets%/icons/arrow-counterclockwise.svg';
import Plus from '%assets%/icons/patch-plus.svg';
import Previous from '%assets%/icons/arrow-left.svg';
import Trash from '%assets%/icons/trash.svg';
import Pen from '%assets%/icons/pen.svg';
import Close from '%assets%/icons/close.svg';

export default class ModuleThree implements Module {
  // User interface
  private readonly uimanager: UIManager;

  private readonly levelList = new MultifunctionalListLayer();

  constructor(private readonly gameRunner: GameRunner, private readonly game: Game) {
    this.uimanager = game.uimanager;
  }

  start(): void {
    this.prepareui();
    this.openMenu();
  }

  /** Prepares user interface; ie. it creates custom layers etc. */
  private prepareui(): void {
    // Set order
    this.uimanager.order = [
      LayerType.Actions,
      LayerType.Runner,
      LayerType.Custom0,
      LayerType.Custom1,
      LayerType.Module,
    ];

    // Create custom layers
    this.uimanager.create(this.levelList, LayerType.Custom0);
  }

  /** Opens a menu with created levels / saved games */
  private openMenu(): void {
    // Set items in action buttons
    (this.uimanager.layer(LayerType.Actions) as ActionsLayer).set({
      onclick: index => {
        if (index === 0) {
          // TODO:
        } else {
          this.game.showMenu();
        }
      },
      items: [
        { src: Play, title: 'saved games' },
        { src: Restart, title: 'back to menu' },
      ],
    });

    // Update lists
    this.updateLevelsList();

    // Show propper layers
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Actions, LayerType.Custom0);
  }

  /** Updates the list of created levels */
  private updateLevelsList(): void {
    const items: MultifunctionalListItem[] = [];

    // Create the highlighted 'Create new level' button
    items.push({
      title: 'Create new level',
      description: '',
      onclick: this.openEditor.bind(this),
      actions: [{ src: Plus, title: 'Start new game', onclick: this.openEditor.bind(this) }],
      highlighted: true,
    });

    const levels = Storage.get<CustomLevel>('levels').all;

    // Open the editor
    const edit = (id: string) => this.openEditor(Storage.get<CustomLevel>('levels').findOne(id));

    // Open game window
    const play = (id: string) => {
      const level = Storage.get<CustomLevel>('levels').findOne(id);
      if (level) this.openRunner(level);
    };

    // Remove level from localStorage
    const remove = (id: string) => {
      Storage.remove('levels', id);
      this.updateLevelsList();
    };

    // Create a list with created levels
    items.push(
      ...levels.map(level => ({
        title: level.name,
        description: '',
        actions: [
          { src: Play, title: 'Play', onclick: () => play(level.id) },
          { src: Pen, title: 'Edit', onclick: () => edit(level.id) },
          { src: Trash, title: 'Remove', onclick: () => remove(level.id) },
        ],
        onclick: () => edit(level.id),
      }))
    );

    this.levelList.set(items);
  }

  /** Opens the editor for */
  private openEditor(level?: CustomLevel): void {
    this.uimanager.hideAll();

    // TODO: Open the editor
    setTimeout(this.openMenu.bind(this), 500);
  }

  /** Opens the game runner */
  private openRunner(level: Level, inEditor: boolean = false): void {
    // Hide all layers except GameRunner
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Runner);

    const runner = this.uimanager.layer(LayerType.Runner) as RunnerLayer;

    runner.resize(); // Resize the canvas to match browser window size
    runner.hideOverlay(); // Hide pause screen

    this.updateUI(inEditor, level);

    // Set level
    this.gameRunner.setLevel(level);
  }

  /**
   * Updates actions and control buttons
   * @param inEditor Determines if the level was started from the menu, or the editor
   */
  private updateUI(inEditor: boolean, level: Level, saved?: SavedCustomGame) {
    const runner = this.uimanager.layer(LayerType.Runner) as RunnerLayer;

    if (inEditor) {
      /* TODO: */
    }

    const save = () => {
      let id = saved?.id;
      let name = saved?.name;

      // If the current game has not been ever saved
      if (!saved) {
        let input;

        // Ask for a name for this game
        do {
          input = prompt('Enter a name for this game');
          if (input === null) return false;
        } while (!input);

        // Set name and generate an id
        name = input;
        id = uuid();
      }

      // Save current game
      const save: SavedCustomGame = {
        id: id!,
        name: name!,
        level,
        layout: this.gameRunner.getLayout(),
      };

      saved = save; // TODO: Test it
      Storage.append('custom-games', save);

      return true;
    };

    // If the level was run from the menu
    // Set action buttons contents
    (this.uimanager.layer(LayerType.Actions) as ActionsLayer).set({
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
      items: [{ src: Previous, title: 'back to menu' }],
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
