import Level from './models/Level';
import LevelLayout from './models/LevelLayout';
import Stats from './models/Stats';
import getGridSize from './utils/getGridSize';
import isLayoutCompatible from './utils/isLayoutCompatible';
import Stopwatch from './utils/Stopwatch';

abstract class Drawable {
  private position: Position;
  abstract color: string = 'red';

  constructor(position: Position) {
    this.position = position;
  }

  draw(ctx: CanvasRenderingContext2D, size: number) {
    const { x, y } = this.position;
    ctx.fillStyle = this.color;
    ctx.fillRect(x * size, y * size, size, size);
  }

  moveTo(position: Position) {
    this.position = position;
  }
}
class Player extends Drawable {
  color = 'aqua';
}
class Box extends Drawable {
  color = 'gold';
}
class Target extends Drawable {
  color = 'tomato';
}
class Wall extends Drawable {
  color = 'navy';
}

export default class GameRunner {
  private static readonly MaxGridSize = 50;

  // Utilities
  private readonly ctx: CanvasRenderingContext2D;
  private gridSize: number = 0;

  // Level
  private level: Level | undefined; // Copy of currently played level - for reloading

  private player: Player = new Player({ x: 0, y: 0 });
  private layout: {
    boxes: Box[];
    targets: Target[];
    walls: Wall[];
  } = { boxes: [], targets: [], walls: [] };

  // Statistics
  // ? Maybe change this to Stats object
  private stopwatch: Stopwatch = new Stopwatch();
  private playerMoves: number = 0;
  private boxMoves: number = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.init();
  }

  /**
   * TODO:
   * Initializes everything that could be done outside of the constructor
   */
  private init(): void {
    this.draw();
  }

  /** Returns statistics of current game */
  get stats(): Stats {
    return {
      time: this.stopwatch.time,
      moves: {
        player: this.playerMoves,
        box: this.boxMoves,
      },
    };
  }

  /**
   * TODO:
   * Returns if the game is finished
   */
  get finished(): boolean {
    return false;
  }

  /**
   * TODO:
   * Starts the game
   * Allows the player to move around
   */
  start(): void {}

  /**
   * TODO:
   * Stops the game
   * Blocks the player from moving
   */
  stop(): void {}

  /**
   * TODO:
   * Restores default level layout
   */
  reset(): void {}

  /** Resets stats */
  private resetStats(): void {
    this.stopwatch.reset();
    this.playerMoves = 0;
    this.boxMoves = 0;
  }

  /**
   * TODO:
   * Sets new level
   */
  setLevel(level: Level): void {
    this.level = level;
    this.updateGrid();
    this.setLayout(level);
  }

  /**
   * Sets (restores) new level layout
   * Used for loading saved games
   * @param layout
   */
  setLayout(layout: LevelLayout): void {
    if (!this.level) return;

    // Check if layout is compatible
    if (!isLayoutCompatible(layout, this.level)) return;

    // Reset stats
    this.stop();
    this.resetStats();

    // Remove all objects
    this.layout.boxes.length = 0;
    this.layout.targets.length = 0;
    this.layout.walls.length = 0;

    // Create new objects
    this.layout.boxes = layout.boxes.map(position => new Box(position));
    this.layout.targets = layout.targets.map(position => new Target(position));
    this.layout.walls = layout.walls.map(position => new Wall(position));

    // Update player position
    this.player.moveTo(layout.start);

    // Resume game
    this.start();
  }

  /** Draws the gameboard */
  private draw(): void {
    // Clear the canvas
    const { e: offsetLeft, f: offsetTop } = this.ctx.getTransform();
    const { width, height } = this.ctx.canvas;
    this.ctx.clearRect(-offsetLeft, -offsetTop, width, height);

    // Draw all objects
    [
      this.player,
      ...this.layout.boxes,
      ...this.layout.targets,
      ...this.layout.walls,
    ].forEach((object: Drawable) => object.draw(this.ctx, this.gridSize));

    // Draw again
    requestAnimationFrame(this.draw.bind(this));
  }

  /** Updates grid size according to canvas width and height */
  updateGrid(): void {
    const { width: canvasWidth, height: canvasHeight } = this.ctx.canvas;

    // If there is no level, set grid size to 0 and center canvas
    if (!this.level) {
      this.gridSize = 0;
      this.ctx.setTransform(1, 0, 0, 1, canvasWidth / 2, canvasHeight / 2);
      return;
    }

    // Get and set grid size
    const gridSize = Math.min(getGridSize(this.ctx.canvas, this.level), GameRunner.MaxGridSize); // Keeps grid size under within range
    this.gridSize = gridSize;

    // Calculate offsets and set transform
    const { width: levelWidth, height: levelHeight } = this.level;

    const offsetTop = (canvasHeight - gridSize * levelHeight) / 2;
    const offsetLeft = (canvasWidth - gridSize * levelWidth) / 2;

    this.ctx.setTransform(1, 0, 0, 1, offsetLeft, offsetTop);
  }
}
