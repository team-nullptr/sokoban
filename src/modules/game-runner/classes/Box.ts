import Movable from '../models/Movable';

export default class Box extends Movable {
  draw(size: number) {
    const x = this.position.x * size;
    const y = this.position.y * size;

    // TODO: Change to image asset
    this.ctx.fillStyle = this.asset;
    this.ctx.fillRect(x, y, size, size);
  }
}
