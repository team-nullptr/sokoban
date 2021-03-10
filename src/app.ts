import { LayerType } from './modules/ui-manager/models/LayerType';
import UIManager from './modules/ui-manager/UIManager';

// Create a frame for rendering the content
const main = document.createElement('main');
document.body.appendChild(main);

const manager = new UIManager(main);

manager
  .layer(LayerType.GameRunner)
  ?.set({ stats: { time: 100 }, onclick: () => console.log('clicked') });
