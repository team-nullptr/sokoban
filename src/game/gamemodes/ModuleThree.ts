import Module from '../../models/Module';
import { LayerType } from '../../modules/ui-manager/models/LayerType';
import UIManager from '../../modules/ui-manager/UIManager';
import ActionsLayer from '../../modules/ui-manager/views/ActionsLayer';
import Game from '../Game';
import MultifunctionalListLayer, {
  MultifunctionalListItem,
} from '../../modules/ui-manager/views/MultifunctionalListLayer';

// Images
import Play from '%assets%/icons/play.svg';
import Restart from '%assets%/icons/arrow-counterclockwise.svg';
import Plus from '%assets%/icons/patch-plus.svg';

export default class ModuleThree implements Module {
  // User interface
  private readonly uimanager: UIManager;

  private readonly levelList = new MultifunctionalListLayer();

  constructor(private readonly game: Game) {
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

    // TODO: Create other items

    this.levelList.set(items);
  }

  /** Opens the editor for */
  private openEditor(): void {
    this.uimanager.hideAll();

    // TODO: Open the editor
  }
}
