import GameRunner from './modules/game-runner/GameRunner';
import Level from './modules/game-runner/models/Level';
import { LayerType } from './modules/ui-manager/models/LayerType';
import UIManager from './modules/ui-manager/UIManager';
import Actor from './modules/game-runner/models/Actor';
import ImageLoader from './modules/ImageLoader';

// Images
import Wall from '%assets%/images/block_08.png';
import Box from '%assets%/images/crate_02.png';
import Target from '%assets%/images/crate_27.png';
import Player from '%assets%/images/player_tileset.png';
import PlayerFace from '%assets%/images/player_face.png';

// Load images
const loader = new ImageLoader();
loader.add('wall', Wall);
loader.add('box', Box);
loader.add('target', Target);
loader.add('player-tileset', Player); // Change to Player
loader.load().then(() => {
  Actor.assets = loader.all;
});

// Create a frame for rendering the content
const main = document.createElement('main');
document.body.appendChild(main);

const manager = new UIManager(main);

const runnerLayer = manager.layer(LayerType.Runner);

// @ts-ignore
// We can safely ignore this error
// because RunnerLayer has ctx getter
// that doesn't exist on Layer type
const context = runnerLayer?.ctx;

const level: Level = {
  boxes: [{ x: 1, y: 1 }],
  height: 5,
  width: 10,
  start: { x: 2, y: 2 },
  targets: [{ x: 3, y: 3 }],
  walls: [{ x: 2, y: 1 }],
};

const runner = new GameRunner(context);
runner.setLevel(level);

import Previous from '%assets%/icons/arrow-left.svg';
import Restart from '%assets%/icons/arrow-counterclockwise.svg';
import Next from '%assets%/icons/arrow-right.svg';

runnerLayer?.set({
  runner, // Used for resizing
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
  onclick: console.log,
});
