import Stopwatch from './Stopwatch';

export default class Animation {
  private static Animations: Animation[] = [];

  /** Starts all animations */
  static start(): void {
    Animation.Animations.forEach(animation => animation.start());
  }

  /** Stops all animations */
  static stop(): void {
    Animation.Animations.forEach(animation => animation.stop());
  }

  /** Resets all animations */
  static reset(): void {
    Animation.Animations.forEach(animation => animation.reset());
  }

  private timer = new Stopwatch();

  /**
   * @param duration - animation duration in ms, default 300
   */
  constructor(private readonly duration: number) {
    this.duration = Math.max(1, duration);
    Animation.Animations.push(this);
  }

  /** Starts animation */
  start(): void {
    this.timer.start();
  }

  /** Stops animation */
  stop(): void {
    this.timer.stop();
  }

  /** Resets animation */
  reset(): void {
    this.timer.reset();
  }

  /** Returns if animation has been finished or hasn't been ever started */
  get finished(): boolean {
    return this.progress === 1;
  }

  /** Returns animation progress */
  get progress(): number {
    const time = this.timer.time;
    const progress = time / this.duration;

    // Return progress (max value is 1)
    return progress > 1 ? 1 : progress;
  }
}
