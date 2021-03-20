import GameRunner from '../modules/game-runner/GameRunner';
import Actor from '../modules/game-runner/models/Actor';
import { LayerType } from '../modules/ui-manager/models/LayerType';
import UIManager from '../modules/ui-manager/UIManager';
import RunnerLayer from '../modules/ui-manager/views/RunnerLayer';

// Images
import Images from './Images';

// Modules
import ModuleOne from './gamemodes/ModuleOne';
import ModuleTwo from './gamemodes/ModuleTwo';

export default class Game {
  readonly uimanager: UIManager;

  // Modules
  private readonly moduleOne: ModuleOne;
  private readonly moduleTwo: ModuleTwo;

  constructor() {
    // Create app frame
    const main = document.createElement('main');
    document.body.appendChild(main);

    // Initialize UIManager
    this.uimanager = new UIManager(main);

    // Initialize GameRunner
    const runnerLayer = this.uimanager.layer(LayerType.Runner) as RunnerLayer;

    const runner = new GameRunner(runnerLayer.ctx);
    runnerLayer.set({ runner });

    // Initialize modules
    this.moduleOne = new ModuleOne(runner, this);
    this.moduleTwo = new ModuleTwo(this);

    // Load images
    this.loadImages().then(() => {
      // After loading all images, show module selection menu

      this.uimanager.layer(LayerType.Module)!.set({ onclick: this.run.bind(this) });
      this.showMenu();
    });
  }

  /** Loads images */
  private async loadImages(): Promise<void> {
    await Images.load();
    Actor.assets = Images.all;
  }

  /** Runs module */
  private run(module: number): void {
    if (module === 0) this.moduleOne.start();
    else if (module === 1) this.moduleTwo.start();
  }

  /** Shows module selection menu */
  showMenu(): void {
    this.uimanager.hideAll();
    this.uimanager.show(LayerType.Module);
  }
}
