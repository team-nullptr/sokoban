import { LayerType } from './models/LayerType';
import Layer from './models/Layer';
import RunnerLayer from './views/RunnerLayer';
import ActionsLayer from './views/ActionsLayer';
import MultifunctionalListLayer from './views/MultifunctionalListLayer';
import EditorLayer from './views/EditorLayer';
import AuthorsLayer from './views/AuthorsLayer';

export default class UIManager {
  private readonly layers = new Map<LayerType, Layer | undefined>();

  private readonly order = [
    LayerType.Actions,
    LayerType.Authors,
    LayerType.Module,
    LayerType.Custom0,
    LayerType.Custom1,
    LayerType.Custom2,
    LayerType.Editor,
    LayerType.Runner,
  ];

  constructor(private frame: HTMLElement) {
    this.init();
    this.render();
  }

  /** Initializes all layers */
  private init(): void {
    this.layers.set(LayerType.Runner, new RunnerLayer(this));
    this.layers.set(LayerType.Actions, new ActionsLayer());
    this.layers.set(LayerType.Editor, new EditorLayer());
    this.layers.set(LayerType.Authors, new AuthorsLayer());

    // Items are initialized in Game.ts
    const module = new MultifunctionalListLayer('Module');
    this.layers.set(LayerType.Module, module);
  }

  /** Renders all layers inside the frame */
  private render(): void {
    // Clear current frame content
    this.frame.innerHTML = '';

    // Render and append all layers to the frame
    this.order
      .slice()
      .reverse()
      .forEach(type => {
        const layer = this.layers.get(type);

        if (layer) {
          // Render the layer
          layer.render();
          this.frame.appendChild(layer.element);
          layer.element.dataset.layer = type.toString();
          layer.rendered();
        } else {
          // Create a placeholder
          const placeholder = document.createElement('div');
          placeholder.dataset.layer = type.toString();
          this.frame.appendChild(placeholder);
        }
      });
  }

  /** Returns specific layer */
  layer(layer: LayerType): Layer | undefined {
    return this.layers.get(layer);
  }

  /** Creates custom layer */
  create(layer: Layer, slot: LayerType.Custom0 | LayerType.Custom1 | LayerType.Custom2): void {
    // Render the layer
    this.layers.set(slot, layer);
    layer.render();

    // Find an element to put new layer into
    const old = this.frame.querySelector(`[data-layer='${slot.toString()}']`);
    const created = layer.element;
    old?.parentElement?.replaceChild(created, old);

    // Set dataset for new layer and call rendered method
    layer.element.dataset.layer = slot.toString();
    layer.rendered();
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

  /** Hides all layers */
  hideAll(): void {
    this.layers.forEach(layer => layer?.hide());
  }
}
