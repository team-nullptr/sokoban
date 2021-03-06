import Vector from './Vector';

/** Represents visible object that does not change it's location */
export default abstract class Actor {
  protected readonly ctx: CanvasRenderingContext2D;
  protected readonly asset: string;

  protected position: Vector;

  // TODO: Change asset to HTMLImageElement
  constructor(ctx: CanvasRenderingContext2D, position: Vector, asset: string) {
    this.ctx = ctx;
    this.position = position;
    this.asset = asset;
  }

  /**
   * Draws on canvas
   * @param size Grid size
   */
  abstract draw(size: number): void;

  /** Provides additional logic to reset state of the actor */
  reset(): void {}
}
