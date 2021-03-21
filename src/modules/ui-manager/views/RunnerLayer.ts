import GameRunner from '../../game-runner/GameRunner';
import Layer from '../models/Layer';
import { LayerType } from '../models/LayerType';
import UIManager from '../UIManager';
import ControlsWidget from './ControlsWidget';
import StatsWidget from './StatsWidget';

export default class RunnerLayer extends Layer {
  element = document.createElement('section');

  private readonly context: CanvasRenderingContext2D;

  // References to widgets
  private readonly stats = new StatsWidget();
  private readonly controls = new ControlsWidget();
  private runner?: GameRunner;

  // Event handlers
  private onFinishHandle: () => void = () => {};

  constructor(private readonly uimanager: UIManager) {
    super();

    // Create canvas element and get ctx
    const canvas = document.createElement('canvas');
    this.context = canvas.getContext('2d')!;

    // Set onclick action to pause button
    this.setPauseAction();

    // Make sure widgets are rendered
    this.stats.render();
    this.controls.render();

    // Listen for window resize
    addEventListener('resize', this.resize.bind(this));
  }

  /** Resizes the canvas */
  resize(): void {
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

  /** Pauses the game */
  private pause(): void {
    this.runner?.stop();
    this.controls.show();
    this.uimanager.layer(LayerType.Actions)!.show();
  }

  /** Hides pause screen overlay */
  hideOverlay(): void {
    this.uimanager.layer(LayerType.Actions)!.hide();
    this.controls.hide();
  }

  /** Resumes the game */
  private resume(): void {
    this.hideOverlay();
    this.runner?.start();
  }

  /** Adds action executed when clicking on pause button */
  private setPauseAction(): void {
    this.stats.set({
      onclick: () => {
        if (this.runner?.paused) this.resume();
        else this.pause();
      },
    });
  }

  /** Sets handle for onFinish event */
  set onFinish(handle: () => void) {
    this.onFinishHandle = handle;
  }

  set(args: any) {
    if (args?.runner instanceof GameRunner) {
      this.runner = args.runner;

      // Update stats every time the game is rendered
      this.runner!.onDraw = () => this.stats.set({ stats: this.runner?.stats });
      this.runner!.onFinish = () => {
        this.onFinishHandle();
        this.uimanager.layer(LayerType.Actions)!.show();
        this.controls.show();
      };
    }

    // Pass args to ControlsWidget instance
    this.controls.set(args);
  }

  /** Returns canvas' context */
  get ctx(): CanvasRenderingContext2D {
    return this.context;
  }

  render() {
    this.element.classList.add('runner');

    // Compose new element
    this.element.innerHTML = '';
    this.element.append(this.stats.element); // Add StatsWidget
    this.element.append(this.context.canvas); // Add canvas for game view
    this.element.append(this.controls.element); // Add ControlsWidget
  }

  rendered() {
    this.resize();
  }
}
