import Level from '../../models/Level';
import GameRunner from '../../modules/game-runner/GameRunner';
import { LayerType } from '../../modules/ui-manager/models/LayerType';
import UIManager from '../../modules/ui-manager/UIManager';
import ListLayer from '../../modules/ui-manager/views/ListLayer';
import { LevelsAdvanced, LevelsAmateur, LevelsNovice } from '../builtin-levels/LevelsModuleOne';

import Previous from '%assets%/icons/arrow-left.svg';
import Restart from '%assets%/icons/arrow-counterclockwise.svg';
import Next from '%assets%/icons/arrow-right.svg';
import clamp from '../../utils/clamp';
import RunnerLayer from '../../modules/ui-manager/views/RunnerLayer';

export default class ModuleOne {
  constructor(private readonly gameRunner: GameRunner, private readonly uimanager: UIManager) {}

  private levels: Level[] = [];
  private level = 0;

  /** Runs the module */
  run(): void {
    // Prepare UI
    this.prepareUI();
    this.uimanager.order = [LayerType.Runner, LayerType.Custom0, LayerType.Module];

    this.uimanager.show(LayerType.Custom0);
  }

  /** Prepares user interface, ie. difficulty selection and pause screen */
  private prepareUI(): void {
    // Create difficulty selection
    const difficulty = new ListLayer();

    difficulty.set({
      items: [{ title: 'Novice' }, { title: 'Amateur' }, { title: 'Advanced' }],
      onclick: this.start.bind(this),
    });

    this.uimanager.create(difficulty, LayerType.Custom0);

    // Set pause screen items
    this.uimanager.layer(LayerType.Runner)?.set({
      items: [
        {
          src: Previous,
          title: 'previous',
        },
        {
          src: Restart,
          title: 'restart',
        },
        {
          src: Next,
          title: 'next',
        },
      ],
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

  private runCurrentLevel(): void {
    this.gameRunner.setLevel(this.levels[this.level]); // Play selected level
    (this.uimanager.layer(LayerType.Runner) as RunnerLayer).hideOverlay(); // Hide pause screen
  }

  /** Starts new game on level with selected difficulty */
  private start(difficulty: number): void {
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
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Runner);

    // Resize the canvas to match browser window size
    // This has to be done after showing Runner layer,
    // to correctly measure Stats widget height
    (this.uimanager.layer(LayerType.Runner) as RunnerLayer).resize();
  }
}
