import Module from '../../models/Module';
import { LayerType } from '../../modules/ui-manager/models/LayerType';
import UIManager from '../../modules/ui-manager/UIManager';
import ActionsLayer from '../../modules/ui-manager/views/ActionsLayer';
import Game from '../Game';

// Images
import Previous from '%assets%/icons/arrow-left.svg';
import Reward from '%assets%/icons/award.svg';

export default class ModuleTwo implements Module {
  private readonly uimanager: UIManager;

  constructor(private readonly game: Game) {
    this.uimanager = game.uimanager;
  }

  /** Runs the module */
  start(): void {
    this.uimanager.order = [
      LayerType.Runner,
      LayerType.Actions,
      LayerType.Custom0,
      LayerType.Module,
    ];

    // Show menu
    this.showMenu();
  }

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
    this.uimanager.show(LayerType.Actions); // Add LayerType.Custom0,
  }
}
