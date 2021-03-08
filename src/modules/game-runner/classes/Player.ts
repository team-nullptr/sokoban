import { Direction } from '../models/Direction';
import Movable from '../models/Movable';

export default class Player extends Movable {
  assetKey = 'player-tileset';

  private moved = false; // Has the player ever moved?

  get animating(): boolean {
    return !this.animation.finished && this.moved;
  }

  move(direction: Direction): void {
    if (this.animating) return; // If the animation is playing, stop function execution

    this.moved = true;
    super.move(direction);
  }

  reset(): void {
    super.reset();
    this.moved = false;
  }
}
