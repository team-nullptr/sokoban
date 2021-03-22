import Module from '../../models/Module';
import { LayerType } from '../../modules/ui-manager/models/LayerType';
import UIManager from '../../modules/ui-manager/UIManager';
import ActionsLayer from '../../modules/ui-manager/views/ActionsLayer';
import Game from '../Game';
import MultifunctionalListLayer, {
  MultifunctionalListItem,
} from '../../modules/ui-manager/views/MultifunctionalListLayer';
import Level from '../../models/Level';
// import { LevelsModuleTwo } from '../builtin-levels/LevelsModuleTwo';
import { LevelsNovice } from '../builtin-levels/LevelsModuleOne';
import RunnerLayer from '../../modules/ui-manager/views/RunnerLayer';
import GameRunner from '../../modules/game-runner/GameRunner';
import Storage from '../../modules/storage/Storage';
import SavedGame from '../../modules/storage/models/SavedGame';

// Images
import Next from '%assets%/icons/arrow-right.svg';
import Play from '%assets%/icons/play.svg';
import Plus from '%assets%/icons/patch-plus.svg';
import Previous from '%assets%/icons/arrow-left.svg';
import Restart from '%assets%/icons/arrow-counterclockwise.svg';
import Reward from '%assets%/icons/award.svg';
import Trash from '%assets%/icons/trash.svg';
import Close from '%assets%/icons/close.svg';

export default class ModuleTwo implements Module {
  private readonly uimanager: UIManager;

  constructor(private readonly gameRunner: GameRunner, private readonly game: Game) {
    this.uimanager = game.uimanager;
  }

  private levels: Level[] = [...LevelsNovice];
  private level = 0;

  /** Runs the module */
  start(): void {
    // Prepare ui
    this.prepare();
    this.uimanager.order = [
      LayerType.Actions,
      LayerType.Runner,
      LayerType.Custom0,
      LayerType.Custom1,
      LayerType.Module,
    ];

    // Show menu
    this.showMenu();
  }

  private readonly savedGamesList = new MultifunctionalListLayer();
  private readonly rankingList = new MultifunctionalListLayer();

  private isRankingShown = false;

  /** Prepares user interface */
  private prepare(): void {
    // Create a list of saved games
    this.updateSavedGamesList();
    this.updateRankingList();
    this.uimanager.create(this.savedGamesList, LayerType.Custom0);
    this.uimanager.create(this.rankingList, LayerType.Custom1);

    const runnerLayer = this.uimanager.layer(LayerType.Runner) as RunnerLayer;
    // Set pause screen action

    runnerLayer.set({
      onclick: (option: number) => {
        // Restart
        if (option === 1) return this.runCurrentLevel();

        // Save to ranking
        if (option === 0) {
          const confirmation = confirm(
            'This action will remove current game from the list, and save it in ranking. Do you want to continue?'
          );

          if (!confirmation) return;

          const exit = this.saveToRanking();
          if (exit) this.showMenu();

          return;
        }

        // If current level is not finished, stop function execution
        if (!this.gameRunner.finished) return;

        // Run next level

        // Find new level index
        const updated = this.level + 1;
        const clamped = Math.min(updated, this.levels.length - 1); // Prevent level index from going out of bounds

        // Decide if level needs to be updated
        const needsUpdate = this.level !== clamped;
        if (!needsUpdate) return; // TODO: End

        // Update level
        this.level = clamped; // Update index
        this.runCurrentLevel();
      },
    });

    // Set handler for onFinish event
    runnerLayer.onFinish = this.updateControls.bind(this);

    // Reset state
    this.isRankingShown = false;
  }

  /** Updates a list with saved games */
  private updateSavedGamesList(): void {
    const items: MultifunctionalListItem[] = [];

    // Add 'Start new game' button
    items.push({
      title: 'Start new game',
      description: '',
      onclick: () => this.startGame(),
      actions: [{ src: Plus, title: 'Start new game', onclick: () => this.startGame() }],
      highlighted: true,
    });

    const run = (id: string) => {
      const game = Storage.game(id);
      if (game) this.startGame(game);
    };

    // Add saved games to the list
    items.push(
      ...Storage.allGames().map(game => ({
        title: game.name,
        description: `Level ${game.level + 1}/${this.levels.length} | ${game.points} point${
          game.points === 1 ? '' : 's'
        }`,
        actions: [
          { src: Play, title: 'Play this level', onclick: () => run(game.id!) },
          {
            src: Trash,
            title: 'Delete this level',
            onclick: () => {
              Storage.removeGame(game.id!);
              this.updateSavedGamesList();
            },
          },
        ],
        onclick: () => run(game.id!),
      }))
    );

    this.savedGamesList.set(items);
  }

  /** Updates a list with ranking */
  private updateRankingList(): void {
    const items: MultifunctionalListItem[] = Storage.ranking()
      .sort((a, b) => b.points - a.points) // Sort in descending order
      .map(entry => ({
        title: entry.name,
        description: `${entry.points} point${entry.points === 1 ? '' : 's'}`,
        onclick: () => {},
        actions: [],
      }));

    this.rankingList.set(items);
  }

  /** Shows menu with saved games / ranking */
  private showMenu(): void {
    (this.uimanager.layer(LayerType.Actions) as ActionsLayer).set({
      onclick: index => {
        if (index === 0) {
          this.isRankingShown = !this.isRankingShown;
          this.showMenu();
        } else this.game.showMenu();
      },
      items: [
        this.isRankingShown
          ? { src: Play, title: 'saved games' }
          : { src: Reward, title: 'view ranking' },
        { src: Previous, title: 'back to menu' },
      ],
    });

    // Show proper layers
    this.uimanager.hideAll();
    this.uimanager.show(
      this.isRankingShown ? LayerType.Custom1 : LayerType.Custom0,
      LayerType.Actions
    );
  }

  /** If the game was saved, this variable stores its metadata (ie. level id and name)  */
  private saved?: { id?: string; name: string };

  /**
   * Saves current game on saved games list
   * @returns If the app should proceed to next step (like close the Runner window)
   */
  private save(): boolean {
    const saveConfirm = confirm('Do you want to save your progress?');

    if (!saveConfirm) {
      // If the player doesn't want to save their progress
      const confirmation = confirm("Your progress won't be saved. Do you want to continue?");

      if (confirmation) return true;
      return false;
    }

    let name = this.saved?.name;
    let id = this.saved?.id;

    if (!name) {
      // Ask for level name if needed
      let input = undefined;

      while (!input) {
        input = prompt('Type a name for this save');
        if (input === null) return false;
      }

      name = input;
    }

    // Save the game
    const finished = this.gameRunner.finished;

    const save: SavedGame = {
      id,
      name,
      level: Math.min(this.level + (finished ? 1 : 0), this.levels.length - 1), // ? Można by było usunąć to sprawdzenie po dodaniu zapisu do rankingu
      points: 0, // TODO: Liczenie punktów
    };

    if (!finished) {
      // Add level layout to the save
      const stats = this.gameRunner.stats;
      const layout = this.gameRunner.getLayout();

      save.saved = { ...stats, ...layout };
    }

    // Save the game
    Storage.saveGame(save);
    this.updateSavedGamesList(); // Update user interface

    return true;
  }

  /**
   * Saves current game in the ranking and removes it from saved games list
   * @returns If the app should proceed to next step (like close the Runner window)
   */
  private saveToRanking(): boolean {
    let name = this.saved?.name;
    let id = this.saved?.id;

    if (!name) {
      // Ask for level name if needed
      let input = undefined;

      while (!input) {
        input = prompt('Type a name for this save');
        if (input === null) return false;
      }

      name = input;
    }

    Storage.saveToRanking({ name, points: 0 }); // TODO: Calculate points

    if (id) Storage.removeGame(id);
    this.updateRankingList();

    return true;
  }

  /** Starts new game */
  private startGame(saved?: SavedGame): void {
    // Start new game
    if (saved) {
      this.level = saved.level;
      this.saved = saved;
    } else {
      this.saved = undefined;
      this.level = 0;
    }

    this.runCurrentLevel();

    if (saved?.saved) {
      this.gameRunner.setLayout(saved.saved);
      this.gameRunner.stats = saved.saved;
    }

    // Set ActionButton contents
    (this.uimanager.layer(LayerType.Actions) as ActionsLayer).set({
      onclick: () => {
        let exit;

        exit = this.save();

        if (exit) this.showMenu();
      },
      items: [{ src: Previous, title: 'back to menu' }],
    });

    // Hide all layers except GameRunner
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Runner);

    // Resize the canvas to match browser window size
    // This has to be done after showing Runner layer,
    // to correctly measure Stats widget height
    (this.uimanager.layer(LayerType.Runner) as RunnerLayer).resize();
  }

  /** Runs current level */
  private runCurrentLevel(): void {
    (this.uimanager.layer(LayerType.Runner) as RunnerLayer).hideOverlay(); // Hide pause screen

    this.gameRunner.setLevel(this.levels[this.level]); // Play selected level
    this.updateControls();
  }

  /** Updates state of controls buttons on pause screen */
  private updateControls(): void {
    (this.uimanager.layer(LayerType.Runner) as RunnerLayer).set({
      items: [
        { src: Close, title: 'stop' },
        { src: Restart, title: 'restart' },
        { src: Next, title: 'next', locked: !this.gameRunner.finished },
      ],
    });
  }
}
