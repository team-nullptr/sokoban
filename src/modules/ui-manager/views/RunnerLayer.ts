import GameRunner from '../../game-runner/GameRunner';
import Layer from '../models/Layer';
import StatsWidget from './StatsWidget';

export default class RunnerLayout extends Layer {
  element = document.createElement('section');

  private readonly context: CanvasRenderingContext2D;

  // References to widgets
  private readonly stats = new StatsWidget();
  private runner?: GameRunner;

  constructor() {
    super();

    // Create canvas element and get ctx
    const canvas = document.createElement('canvas');
    this.context = canvas.getContext('2d')!;

    // Make sure stats are rendered
    this.stats.render();

    // Listen for window resize
    addEventListener('resize', this.resize.bind(this));
  }

  /** Resizes the canvas */
  private resize() {
    const canvas = this.context.canvas;
    const stats = this.stats.element;

    // Calculate new canvas size
    const height = innerHeight - stats.offsetHeight - 4;
    const width = innerWidth;

    // Update canvas size
    canvas.height = height;
    canvas.width = width;

    this.runner?.updateGrid();
  }

  set(args: any) {
    if (args?.runner instanceof GameRunner) {
      this.runner = args.runner;
      // TODO: Add event listener
    }

    // Pass args to StatsWidget instance
    this.stats.set(args);
  }

  /** Returns canvas' context */
  get ctx(): CanvasRenderingContext2D {
    return this.context;
  }

  render() {
    this.element.className = 'runner';

    // Compose new element
    this.element.innerHTML = '';
    this.element.append(this.stats.element); // Add StatsWidget
    this.element.append(this.context.canvas); // Add canvas for game view
  }

  rendered() {
    this.resize();
  }
}
