import { LayerType } from './models/LayerType';
import Layer from './models/Layer';
import RunnerLayer from './views/RunnerLayer';
import ListLayer from './views/ListLayer';

export default class UIManager {
  private readonly layers = new Map<LayerType, Layer>();

  constructor(private frame: HTMLElement) {
    this.init();
    this.render();
  }

  /** Initializes all layers */
  private init(): void {
    // Runner
    this.layers.set(LayerType.Runner, new RunnerLayer());

    // Module selection
    const module = new ListLayer();
    module.set({
      items: [
        {
          title: 'Moduł pierwszy',
          description: 'Wybierz poziom trudności',
        },
        {
          title: 'Moduł drugi',
          description: 'Zagraj w 20 poziomów o rosnącym poziomie trudności',
        },
        {
          title: 'Moduł trzeci',
          description: 'Zaprojektuj i graj na własnym poziomie',
        },
      ],
    });
    this.layers.set(LayerType.Module, module);
  }

  /** Renders all layers inside the frame */
  private render(): void {
    // Clear current frame content
    this.frame.innerHTML = '';

    // Render and append all layers to the frame
    this.layers.forEach(layer => {
      layer.render();
      this.frame.appendChild(layer.element);
      layer.rendered();
    });
  }

  /** Returns specific layer */
  layer(layer: LayerType): Layer | undefined {
    return this.layers.get(layer);
  }

  /** Creates custom layer */
  create(layer: Layer, slot: LayerType.Custom0): void {
    this.layers.set(slot, layer);
    this.render();
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

  /**
   * Sets layers order
   * @param order Order of elements
   */
  set order(order: LayerType[]) {
    let before: Layer | undefined = undefined;

    order.reverse().forEach(type => {
      const current = this.layer(type);

      if (!current) return;

      if (before) {
        // If current element is not the first element, append it after last element
        before.element.after(current.element);
      } else {
        // If current element is the first element, set it as first children of parent
        current?.element.parentElement?.prepend(current.element);
      }

      before = current;
    });
  }
}
