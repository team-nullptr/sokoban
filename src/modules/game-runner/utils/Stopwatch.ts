export default class Stopwatch {
  private from?: number;
  private elapsed: number = 0;
  private running: boolean = false;

  /** Updates elapsed time */
  private update(): void {
    if (this.from) this.elapsed += Date.now() - this.from; // Add time difference to total elapsed time
    if (this.running) this.from = Date.now(); // Move `from` timestamp
  }

  /** Returns elapsed time */
  get time(): number {
    this.update();
    return this.elapsed;
  }

  /** Returns if the timer is stopped */
  get stopped(): boolean {
    return !this.running;
  }

  /** Starts the stopwatch */
  start(): void {
    this.update();
    this.running = true;
  }

  /** Stops the stopwatch */
  stop(): void {
    this.update();
    this.from = undefined;
    this.running = false;
  }

  /** Resets the timer */
  reset(): void {
    this.from = undefined;
    this.elapsed = 0;
    this.running = false;
  }
}
