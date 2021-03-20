import Level from '../../models/Level';
import GameRunner from '../../modules/game-runner/GameRunner';
import { LayerType } from '../../modules/ui-manager/models/LayerType';
import UIManager from '../../modules/ui-manager/UIManager';
import ListLayer from '../../modules/ui-manager/views/ListLayer';
import { LevelsAdvanced, LevelsAmateur, LevelsNovice } from '../builtin-levels/LevelsModuleOne';
import clamp from '../../utils/clamp';
import RunnerLayer from '../../modules/ui-manager/views/RunnerLayer';
import ActionsLayer from '../../modules/ui-manager/views/ActionsLayer';

// Images
import Previous from '%assets%/icons/arrow-left.svg';
import Restart from '%assets%/icons/arrow-counterclockwise.svg';
import Next from '%assets%/icons/arrow-right.svg';
import Game from '../Game';

export default class ModuleOne {
  private readonly uimanager: UIManager;

  constructor(private readonly gameRunner: GameRunner, private readonly game: Game) {
    this.uimanager = game.uimanager;
  }

  private levels: Level[] = [];
  private level = 0;

  /** Runs the module */
  start(): void {
    // Prepare UI
    this.prepare();
    this.uimanager.order = [LayerType.Runner, LayerType.Custom0, LayerType.Module];

    // Show proper menu
    this.showMenu();
  }

  /** Prepares user interface */
  private prepare(): void {
    // Create difficulty selection menu
    const difficulty = new ListLayer();

    difficulty.set({
      items: [{ title: 'Novice' }, { title: 'Amateur' }, { title: 'Advanced' }],
      onclick: this.run.bind(this),
    });

    this.uimanager.create(difficulty, LayerType.Custom0); // Create new layer, to put the difficulty menu in

    // Set pause screen action
    (this.uimanager.layer(LayerType.Runner) as RunnerLayer).set({
      onclick: (option: number) => {
        if (option === 1) {
          // Restart
          this.runCurrentLevel();
          return;
        }

        // Find new level index
        // If the option was 'Previous', decrement the value, else, increment it
        const updated = option === 0 ? this.level - 1 : this.level + 1;

        // Prevent level index from going out of bounds
        const clamped = clamp(updated, 0, this.levels.length - 1);

        // Decide if level needs to be updated
        const needsUpdate = this.level !== clamped;

        if (!needsUpdate) return;

        // Update level
        this.level = clamped; // Update index
        this.runCurrentLevel();
      },
    });
  }

  /** Shows difficulty selection menu */
  private showMenu(): void {
    // Set ActionButton contents
    (this.uimanager.layer(LayerType.Actions) as ActionsLayer).set({
      onclick: () => this.game.showMenu(),
      items: [{ src: Previous, title: 'back to menu' }],
    });

    // Show proper layers
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Custom0, LayerType.Actions);
  }

  /** Runs current level */
  private runCurrentLevel(): void {
    (this.uimanager.layer(LayerType.Runner) as RunnerLayer).hideOverlay(); // Hide pause screen

    this.updateControls(); // Update control buttons on pause screen
    this.gameRunner.setLevel(this.levels[this.level]); // Play selected level
  }

  /** Updates control buttons on pause screen */
  private updateControls(): void {
    // Set ActionButton contents
    (this.uimanager.layer(LayerType.Actions) as ActionsLayer).set({
      onclick: () => this.showMenu(),
      items: [{ src: Previous, title: 'select difficulty' }],
    });

    // Set actions for controls buttons
    (this.uimanager.layer(LayerType.Runner) as RunnerLayer).set({
      items: [
        { src: Previous, title: 'previous', locked: this.level === 0 },
        { src: Restart, title: 'restart' },
        { src: Next, title: 'next', locked: this.level === this.levels.length - 1 },
      ],
    });
  }

  /** Starts new game on level with selected difficulty */
  private run(difficulty: number): void {
    // Clear this.levels array
    this.levels.length = 0;

    // Fill the array with proper levels
    switch (difficulty) {
      case 0:
        this.levels = [...LevelsNovice];
        break;
      case 1:
        this.levels = [...LevelsAmateur];
        break;
      case 2:
        this.levels = [...LevelsAdvanced];
        break;
    }

    // Start new game
    this.level = 0;
    this.runCurrentLevel();

    // Hide all layers except GameRunner
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Runner);

    // Resize the canvas to match browser window size
    // This has to be done after showing Runner layer,
    // to correctly measure Stats widget height
    (this.uimanager.layer(LayerType.Runner) as RunnerLayer).resize();
  }
}
