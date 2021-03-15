import Actor from './Actor';
import Animation from '../utils/Animation';
import { Direction } from './Direction';
import Vector from './Vector';
import { vectorFromDirection } from '../utils/vectorManipulation';
import { addVectors, multiplyVector } from '../utils/vectorManipulation';

export default abstract class Movable extends Actor {
  protected readonly animation: Animation;
  private offset: Vector = { x: 0, y: 0 }; // Direction to move the player towards

  /** @param duration Animation duration */
  constructor(ctx: CanvasRenderingContext2D, position: Vector, duration: number = 300) {
    super(ctx, position);
    this.animation = new Animation(duration);
  }

  /** Smoothly Moves object towards given direction */
  move(direction: Direction): void {
    // Calculate new position
    const vector = vectorFromDirection(direction);
    const position = addVectors(vector, this.position);

    // Save direction
    this.offset = vector;

    // Change position
    this.position = position;

    // Run animation
    this.animation.reset();
    this.animation.start();
  }

  /** Moves object to a new position */
  moveTo(position: Vector): void {
    this.position = position;
  }

  /** Returns position for drawing */
  private get animatedPosition(): Vector {
    return addVectors(this.position, multiplyVector(this.offset, this.animation.progress - 1));
  }

  get drawingPosition(): Vector {
    return this.animatedPosition;
  }

  reset(): void {
    super.reset();
    this.offset = { x: 0, y: 0 };
  }
}
