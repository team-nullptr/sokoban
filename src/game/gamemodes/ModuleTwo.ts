import Module from '../../models/Module';
import { LayerType } from '../../modules/ui-manager/models/LayerType';
import UIManager from '../../modules/ui-manager/UIManager';
import ActionsLayer from '../../modules/ui-manager/views/ActionsLayer';
import Game from '../Game';
import MultifunctionalListLayer from '../../modules/ui-manager/views/MultifunctionalListLayer';
import Level from '../../models/Level';
import { LevelsModuleTwo } from '../builtin-levels/LevelsModuleTwo';
import RunnerLayer from '../../modules/ui-manager/views/RunnerLayer';
import GameRunner from '../../modules/game-runner/GameRunner';

// Images
import Previous from '%assets%/icons/arrow-left.svg';
import Reward from '%assets%/icons/award.svg';
import Plus from '%assets%/icons/patch-plus.svg';
import Restart from '%assets%/icons/arrow-counterclockwise.svg';
import Next from '%assets%/icons/arrow-right.svg';

export default class ModuleTwo implements Module {
  private readonly uimanager: UIManager;

  constructor(private readonly gameRunner: GameRunner, private readonly game: Game) {
    this.uimanager = game.uimanager;
  }

  private levels: Level[] = [...LevelsModuleTwo];
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

  private prepare(): void {
    // Create a list of saved games
    this.updateSavedGamesList();
    this.uimanager.create(this.savedGamesList, LayerType.Custom0);

    const runnerLayer = this.uimanager.layer(LayerType.Runner) as RunnerLayer;
    // Set pause screen action

    runnerLayer.set({
      onclick: (option: number) => {
        // Restart
        if (option === 0) {
          this.runCurrentLevel();
          return;
        }

        // If current level is not finished, stop function execution
        if (!(option === 1 && this.gameRunner.finished)) {
          return;
        }

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
  }

  private updateSavedGamesList(): void {
    this.savedGamesList.set([
      {
        title: 'Start new game',
        description: '',
        actions: [{ src: Plus, title: 'Start new game', onclick: this.startGame.bind(this) }],
        onclick: this.startGame.bind(this),
        highlighted: true,
      },
    ]);
  }

  /** Shows menu with saved games / ranking */
  private showMenu(): void {
    (this.uimanager.layer(LayerType.Actions) as ActionsLayer).set({
      onclick: index => {
        if (index === 0) console.warn('Should open ranking');
        else this.game.showMenu();
      },
      items: [
        { src: Reward, title: 'view ranking' },
        { src: Previous, title: 'back to menu' },
      ],
    });

    // Show proper layers
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Custom0, LayerType.Actions);
  }

  /** Starts new game */
  private startGame(): void {
    // Start new game
    this.level = 0;
    this.runCurrentLevel();

    // Set ActionButton contents
    (this.uimanager.layer(LayerType.Actions) as ActionsLayer).set({
      onclick: () => this.showMenu(), // TODO: Zapis
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
        { src: Restart, title: 'restart' },
        {
          src: Next,
          title: 'next',
          locked: !this.gameRunner.finished || this.level === this.levels.length - 1,
        },
      ],
    });
  }
}
