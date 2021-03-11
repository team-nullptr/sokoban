export default abstract class Layer {
  /** Layer frame */
  abstract readonly element: HTMLElement;

  /** Sets some property inside the layer */
  set(args?: object): void {}

  /** Renders the layer */
  abstract render(): void;

  /** Called after first render in the DOM */
  rendered(): void {}

  /** Shows the layer */
  show(): void {
    this.element.classList.add('shown');
  }

  /** Hides the layer */
  hide(): void {
    this.element.classList.remove('shown');
  }

  /** Returns if the layer is shown */
  get shown(): boolean {
    return this.element.classList.contains('shown');
  }

  /** Resets component to it's initial state */
  reset(): void {}
}
