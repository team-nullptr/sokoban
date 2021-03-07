import Movable from '../models/Movable';

export default class Box extends Movable {
  draw(size: number): void {
    const position = this.animatedPosition;

    const x = position.x * size;
    const y = position.y * size;

    // TODO: Change to image asset
    this.ctx.fillStyle = this.asset;
    this.ctx.fillRect(x, y, size, size);
  }
}
