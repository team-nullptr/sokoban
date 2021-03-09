import { LayerType } from './models/LayerType';
import Layer from './models/Layer';
import Stats from './views/Stats';

export default class UIManager {
  private readonly layers = new Map<LayerType, Layer>();

  constructor(private frame: HTMLElement) {
    this.init();
    this.render();
  }

  /** Initializes all layers */
  private init(): void {
    this.layers.set(LayerType.Loader, new Stats());
  }

  /** Renders all layers inside the frame */
  private render(): void {
    // Clear current frame content
    this.frame.innerHTML = '';

    // Render and append all layers to the frame
    this.layers.forEach(layer => {
      layer.render();
      this.frame.appendChild(layer.element);
    });
  }

  /** Returns specific layer */
  layer(layer: LayerType): Layer | undefined {
    return this.layers.get(layer);
  }

  /**
   * Shows specific layers
   * @param layers Layers to be shown
   */
  show(...layers: LayerType[]): void {
    layers.forEach(layer => {
      this.layers.get(layer)?.show();
    });
  }

  /**
   * Hides specific layers
   * @param layers Layers to be hidden
   */
  hide(...layers: LayerType[]): void {
    layers.forEach(layer => {
      this.layers.get(layer)?.hide();
    });
  }

  /** Hides all layers */
  hideAll(): void {
    this.layers.forEach(layer => layer.hide());
  }

  // TODO: Set order
}
