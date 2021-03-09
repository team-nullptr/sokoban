import { multiplyVector } from '../utils/vectorManipulation';
import Vector from './Vector';

/** Represents visible object that does not change it's location */
export default abstract class Actor {
  protected static Assets: Map<string, HTMLImageElement> = new Map();

  /** Sets assets map for all actors */
  static set assets(assets: Map<string, HTMLImageElement>) {
    Actor.Assets = assets;
  }

  protected readonly ctx: CanvasRenderingContext2D;
  protected abstract readonly assetKey: string;

  constructor(ctx: CanvasRenderingContext2D, protected position: Vector) {
    this.ctx = ctx;
    this.position = position;
  }

  /** Returns a position to draw at */
  protected get drawingPosition(): Vector {
    return this.position;
  }

  /**
   * Draws on canvas
   * @param size Grid size
   */
  draw(size: number) {
    const asset = this.asset;

    // Get position
    const position = this.drawingPosition;
    const { x, y } = multiplyVector(position, size);

    // If the asset is available, draw it
    // Else, draw a square
    if (asset) this.ctx.drawImage(asset, x, y, size, size);
    else this.ctx.fillRect(x, y, size, size);
  }

  /**
   * Helper function
   * Draws image on canvas
   * @param position
   * @param size
   */

  /** Returns actor position */
  get location(): Vector {
    return { ...this.position };
  }

  /** Returns actor x */
  get x(): number {
    return this.position.x;
  }

  /** Returns actor y */
  get y(): number {
    return this.position.y;
  }

  /** Returns asset for the actor */
  protected get asset(): HTMLImageElement | undefined {
    return Actor.Assets.get(this.assetKey);
  }

  /** Provides additional logic to reset state of the actor */
  reset(): void {}
}
