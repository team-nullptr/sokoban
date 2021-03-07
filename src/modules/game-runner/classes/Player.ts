import { Direction } from '../models/Direction';
import Movable from '../models/Movable';

export default class Player extends Movable {
  private moved = false; // Has the player ever moved?

  move(direction: Direction): void {
    if (!this.animation.finished && this.moved) return; // If the animation is playing, stop function execution

    this.moved = true;
    super.move(direction);
  }

  draw(size: number): void {
    const position = this.animatedPosition;

    const x = position.x * size;
    const y = position.y * size;

    // TODO: Change to image asset
    this.ctx.fillStyle = this.asset;
    this.ctx.fillRect(x, y, size, size);
  }

  reset(): void {
    super.reset();
    this.moved = false;
  }
}
