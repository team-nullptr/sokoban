import GameRunner from '../modules/game-runner/GameRunner';
import Actor from '../modules/game-runner/models/Actor';
import { LayerType } from '../modules/ui-manager/models/LayerType';
import UIManager from '../modules/ui-manager/UIManager';
import RunnerLayer from '../modules/ui-manager/views/RunnerLayer';
import MultifunctionalListLayer, { MultifunctionalListItem } from '../modules/ui-manager/views/MultifunctionalListLayer';

// Images
import Images from './Images';

// Modules
import ModuleOne from './modules/ModuleOne';
import ModuleTwo from './modules/ModuleTwo';
import ModuleThree from './modules/ModuleThree';

export default class Game {
  readonly uimanager: UIManager;

  // Modules
  private readonly moduleOne: ModuleOne;
  private readonly moduleTwo: ModuleTwo;
  private readonly moduleThree: ModuleThree;

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
    this.moduleTwo = new ModuleTwo(runner, this);
    this.moduleThree = new ModuleThree(runner, this);

    // Load images
    Game.loadImages().then(() => {
      // After loading all images, show module selection menu

      // Build module selection menu
      const modules: MultifunctionalListItem[] = [
        ['Module One', 'Choose the difficulty level'],
        ['Module Two', 'Play 20 levels with increasing difficulty level'],
        ['Module Three', 'Create and play on your own levels'],
      ].map((module, index) => ({
        title: module[0],
        description: module[1],
        onclick: () => this.run(index),
      }));

      (this.uimanager.layer(LayerType.Module) as MultifunctionalListLayer).set(modules);
      this.showMenu();
    });
  }

  /** Loads images */
  private static async loadImages(): Promise<void> {
    await Images.load();
    Actor.assets = Images.all;
  }

  /** Runs module */
  private run(module: number): void {
    if (module === 0) this.moduleOne.start();
    else if (module === 1) this.moduleTwo.start();
    else if (module === 2) this.moduleThree.start();
  }

  /** Shows module selection menu */
  showMenu(): void {
    this.uimanager.hideAll();

    this.uimanager.show(LayerType.Authors);
    this.uimanager.show(LayerType.Module);

    (this.uimanager.layer(LayerType.Runner) as RunnerLayer).onFinish = () => {};
  }
}
