import Box from './classes/Box';
import Player from './classes/Player';
import Target from './classes/Target';
import Wall from './classes/Wall';
import Actor from './models/Actor';
import { Direction } from './models/Direction';
import Level from '../../models/Level';
import LevelLayout from '../../models/LevelLayout';
import Stats from '../../models/Stats';
import Vector from './models/Vector';
import { addVectors } from './utils/vectorManipulation';
import getGridSize from './utils/getGridSize';
import isLayoutCompatible from './utils/isLayoutCompatible';
import Stopwatch from './utils/Stopwatch';
import { vectorFromDirection } from './utils/vectorManipulation';
import Animation from './utils/Animation';
import Movable from './models/Movable';

export default class GameRunner {
  private static readonly MaxGridSize = 50;
  static readonly AnimationDuration = 100;

  // Utilities
  private gridSize: number = 0;

  // Event handlers
  private onDrawHandle: () => void = () => {};

  // State
  private completed = false;
  private stopped = false;

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

  constructor(private readonly ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.player = new Player(this.ctx, { x: 0, y: 0 }, GameRunner.AnimationDuration);

    this.init();
  }

  /** Initializes everything that could be done outside of the constructor */
  private init(): void {
    // Listen for user input
    addEventListener('keydown', event => {
      const key = event.key.toLowerCase();

      switch (key) {
        case 'arrowup':
        case 'w':
          this.movePlayerIfPossible(Direction.Up);
          break;
        case 'arrowdown':
        case 's':
          this.movePlayerIfPossible(Direction.Down);
          break;
        case 'arrowleft':
        case 'a':
          this.movePlayerIfPossible(Direction.Left);
          break;
        case 'arrowright':
        case 'd':
          this.movePlayerIfPossible(Direction.Right);
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

  /** Returns if the game is finished */
  get finished(): boolean {
    // Check if every target is occupied
    const everyOccupied = this.layout.targets.every(target =>
      this.layout.boxes.some(box => box.x === target.x && box.y === target.y)
    );

    return everyOccupied;
  }

  /**
   * Starts the game
   * Allows the player to move around
   */
  start(): void {
    this.stopped = false;
    Animation.start();
  }

  /**
   * Stops the game
   * Blocks the player from moving
   */
  stop(): void {
    this.stopwatch.stop();
    this.stopped = true;
    Animation.stop();
  }

  /**
   * Restores default level layout and resets statistics
   * @param restore Whether the layout should be restored or not
   */
  reset(restore: boolean = true): void {
    Animation.reset(); // Reset all ongoing animations

    const movable: Movable[] = [this.player, ...this.layout.boxes];
    movable.forEach(object => object.reset()); // Block objects from moving after clicking 'reset'

    this.completed = false;
    this.stopped = false;

    this.resetStats();

    if (restore && this.level) this.setLayout(this.level);
  }

  /** Resets stats */
  private resetStats(): void {
    this.stopwatch.reset();
    this.playerMoves = 0;
    this.boxMoves = 0;
  }

  private finish(): void {
    console.warn('Finished!');
    this.stopwatch.stop();
    this.completed = true;
  }

  /**
   * TODO: Check if it works
   * Sets new level
   */
  setLevel(level: Level): void {
    this.reset(false); // Do not restore level layout

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
    this.reset(false);

    // Remove all objects
    this.layout.boxes.length = 0;
    this.layout.targets.length = 0;
    this.layout.walls.length = 0;

    // Create new objects
    this.layout.boxes = layout.boxes.map(
      position => new Box(this.ctx, position, GameRunner.AnimationDuration)
    );
    this.layout.targets = layout.targets.map(position => new Target(this.ctx, position));
    this.layout.walls = layout.walls.map(position => new Wall(this.ctx, position));

    // Update player position
    this.player.moveTo(layout.start);

    // Resume game
    this.start();
  }

  /** Moves player towards given direction if it is possible */
  private movePlayerIfPossible(direction: Direction): void {
    if (this.stopped || this.completed) return;

    this.stopwatch.start();

    if (this.player.animating) return;

    const position = addVectors(this.player.location, vectorFromDirection(direction));
    const object = this.objectAt(position);

    if (object === null || object instanceof Target) {
      // If object that was found is air or Target move the player
      this.player.move(direction);
      this.playerMoves++;
    } else if (object instanceof Box) {
      // If object that was found is Box, check if it can be moved
      const boxPosition = addVectors(position, vectorFromDirection(direction));
      const objectBehindBox = this.objectAt(boxPosition);

      // If the box can be moved (allow only "air" and Targets), move it as well as the player
      if (objectBehindBox === null || objectBehindBox instanceof Target) {
        object.move(direction);
        this.player.move(direction);
        this.playerMoves++;
        this.boxMoves++;

        // Stop the game if every box now lies on a target
        if (this.finished) {
          this.finish();
        }
      }
    }
  }

  /**
   * Returns object at given position
   * Returns
   *    instance of game object,
   *    null if nothing was found at given position
   *    or undefined if level was not set or the position is out of bounds
   */
  private objectAt(position: Vector): Box | Target | Wall | null | undefined {
    if (!this.level) return undefined;

    const { boxes, targets, walls } = this.layout;

    // prettier-ignore
    if(position.x < 0 || position.y < 0 || position.x >= this.level.width || position.y >= this.level.height) return undefined;

    // prettier-ignore
    // Check position of every object
    return [...boxes, ...targets, ...walls].find(object => object.x === position.x && object.y === position.y) ?? null;
  }

  /** Draws the gameboard */
  private draw(): void {
    // Clear the canvas
    const { e: offsetLeft, f: offsetTop } = this.ctx.getTransform();
    const { width, height } = this.ctx.canvas;
    this.ctx.clearRect(-offsetLeft, -offsetTop, width, height);

    // Draw all objects
    [
      ...this.layout.walls,
      ...this.layout.targets,
      ...this.layout.boxes,
      this.player,
    ].forEach((object: Actor) => object.draw(this.gridSize));

    // Dispatch onDraw event
    this.onDrawHandle();

    // Draw again
    requestAnimationFrame(this.draw.bind(this));
  }

  /** Sets handle for onDraw event, that is being called every time the game is rendered. */
  set onDraw(handle: () => void) {
    this.onDrawHandle = handle;
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
    const gridSize = Math.min(
      getGridSize(
        { x: this.ctx.canvas.width, y: this.ctx.canvas.height },
        { x: this.level.width, y: this.level.height }
      ),
      GameRunner.MaxGridSize
    ); // Keeps grid size under within range
    this.gridSize = gridSize;

    // Calculate offsets and set transform
    const { width: levelWidth, height: levelHeight } = this.level;

    const offsetTop = (canvasHeight - gridSize * levelHeight) / 2;
    const offsetLeft = (canvasWidth - gridSize * levelWidth) / 2;

    this.ctx.setTransform(1, 0, 0, 1, offsetLeft, offsetTop);
  }
}
