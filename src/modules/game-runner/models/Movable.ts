import Actor from './Actor';
import Animation from '../utils/Animation';
import { Direction } from './Direction';
import Vector from './Vector';
import vectorFromDirection from '../utils/vectorFromDirection';
import { addVectors, multiplyVector } from '../utils/addVectors';

export default abstract class Movable extends Actor {
  protected readonly animation: Animation;
  private direction: Vector = { x: 0, y: 0 };

  /** @param duration Animation duration */
  constructor(
    ctx: CanvasRenderingContext2D,
    position: Vector,
    asset: string,
    duration: number = 300
  ) {
    super(ctx, position, asset);
    this.animation = new Animation(duration);
  }

  /** Smoothly Moves object towards given direction */
  move(direction: Direction): void {
    // Calculate new position
    const vector = vectorFromDirection(direction);
    const position = addVectors(vector, this.position);

    // Save direction
    this.direction = vector;

    // Change position
    this.position = position;

    // Run animation
    this.animation.reset();
    this.animation.start();
  }

  /** Moves object to a new position */
  moveTo(position: Vector) {
    this.position = position;
  }

  /** Returns position for drawing */
  get animatedPosition(): Vector {
    return addVectors(this.position, multiplyVector(this.direction, this.animation.progress - 1));
  }
}
