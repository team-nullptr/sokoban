import GameRunner from '../GameRunner';
import { Direction } from '../models/Direction';
import Movable from '../models/Movable';
import Animation from '../utils/Animation';
import { multiplyVector } from '../utils/vectorManipulation';

export default class Player extends Movable {
  assetKey = 'player-tileset';

  private moved = false; // Had the player ever moved

  // Display and animation
  private direction: Direction = Direction.Down;
  private leg: boolean = false; // A leg to stand on (left or right)
  private idleAnimation = new Animation(GameRunner.AnimationDuration + 200);

  get animating(): boolean {
    return !this.animation.finished && this.moved;
  }

  move(direction: Direction): void {
    if (this.animating) return; // If the animation is playing, stop function execution

    this.moved = true;

    // Set direction
    this.direction = direction;
    this.leg = !this.leg;
    this.idleAnimation.reset();
    this.idleAnimation.start();

    super.move(direction);
  }

  draw(size: number): void {
    const asset = this.asset;

    // Get position
    const position = this.drawingPosition;
    const { x, y } = multiplyVector(position, size);

    // If the asset is not available, draw a square
    if (!asset) return this.ctx.fillRect(x, y, size, size);

    // Find the right direction
    let direction;
    switch (this.direction) {
      case Direction.Up:
        direction = 1;
        break;
      case Direction.Right:
        direction = 2;
        break;
      case Direction.Left:
        direction = 3;
        break;
      default:
        direction = 0;
    }

    // Had the animation been finished or hadn't been ever started?
    const idleAnimationFinished =
      this.idleAnimation.finished || (!this.idleAnimation.finished && !this.moved);

    // If the animation is finished, the player should be in idle position, else, he should be walking
    const pose = idleAnimationFinished ? 0 : this.leg ? 1 : 2;

    this.ctx.drawImage(asset, pose * 64, direction * 64, 64, 64, x, y, size, size);
  }

  reset(): void {
    super.reset();

    this.moved = false;
    this.direction = Direction.Down;
  }
}
