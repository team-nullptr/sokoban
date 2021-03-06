import Box from './classes/Box';
import Player from './classes/Player';
import Target from './classes/Target';
import Wall from './classes/Wall';
import Actor from './models/Actor';
import { Direction } from './models/Direction';
import Level from './models/Level';
import LevelLayout from './models/LevelLayout';
import Stats from './models/Stats';
import getGridSize from './utils/getGridSize';
import isLayoutCompatible from './utils/isLayoutCompatible';
import Stopwatch from './utils/Stopwatch';

export default class GameRunner {
  private static readonly MaxGridSize = 50;
  private static readonly AnimationDuration = 100;

  // Utilities
  private readonly ctx: CanvasRenderingContext2D;
  private gridSize: number = 0;

  // Level
  private level: Level | undefined; // Copy of currently played level - for reloading

  private readonly player: Player;
  private readonly layout: {
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
    this.player = new Player(this.ctx, { x: 0, y: 0 }, 'aqua', GameRunner.AnimationDuration);

    this.init();
  }

  /**
   * TODO:
   * Initializes everything that could be done outside of the constructor
   */
  private init(): void {
    // Listen for user input
    addEventListener('keydown', event => {
      const key = event.key.toLowerCase();

      switch (key) {
        case 'arrowup':
        case 'w':
          this.player.move(Direction.Up);
          break;
        case 'arrowdown':
        case 's':
          this.player.move(Direction.Down);
          break;
        case 'arrowleft':
        case 'a':
          this.player.move(Direction.Left);
          break;
        case 'arrowright':
        case 'd':
          this.player.move(Direction.Right);
          break;
      }
    });

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
    this.layout.boxes = layout.boxes.map(
      position => new Box(this.ctx, position, 'gold', GameRunner.AnimationDuration)
    );
    this.layout.targets = layout.targets.map(position => new Target(this.ctx, position, 'tomato'));
    this.layout.walls = layout.walls.map(position => new Wall(this.ctx, position, 'navy'));

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
    ].forEach((object: Actor) => object.draw(this.gridSize));

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
