import GameRunner from './modules/game-runner/GameRunner';

// Init document structure
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;

document.body.appendChild(canvas);

// Init runner
const runner = new GameRunner(ctx);
runner.setLevel({
  boxes: [{ x: 1, y: 1 }],
  height: 5,
  width: 10,
  start: { x: 2, y: 2 },
  targets: [{ x: 3, y: 3 }],
  walls: [{ x: 2, y: 1 }],
});
runner.updateGrid();

// Canvas size updater
function updateCanvasSize(): void {
  canvas.width = innerWidth - 128;
  canvas.height = innerHeight - 128;
  runner.updateGrid();
}

updateCanvasSize();
addEventListener('resize', updateCanvasSize);
