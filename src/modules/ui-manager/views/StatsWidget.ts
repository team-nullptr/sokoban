import Layer from '../models/Layer';
import '%styles%/main.scss';
import Statistics from '../../../models/Stats';

export default class StatsWidget extends Layer {
  element = document.createElement('section');

  /** References to stats elements */
  private readonly elements = {
    time: document.createElement('span'),
    moves: document.createElement('span'),
    box: document.createElement('span'),
  };

  /** Represents saved stats */
  private stats: Statistics = {
    time: 0,
    moves: {
      box: 0,
      player: 0,
    },
  };

  set(stats?: Statistics) {
    if (!stats) return;

    // Update stats only if provided
    this.stats = { ...this.stats, ...stats };
    this.update();
  }

  private update() {
    // prettier-ignore
    const { time, moves: { box, player }} = this.stats;
    const ftime = (time / 1000).toFixed(3); // Format time

    this.elements.time.textContent = `${ftime} seconds`;
    this.elements.moves.textContent = `${player} moves`;
    this.elements.box.textContent = `${box} box moves`;
  }

  render() {
    this.element.className = 'stats';

    // Update values in elements
    this.update();

    // Create responsive container
    const container = document.createElement('div');
    container.className = 'container';

    // Create wrapper for stats
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    // Create vertical line
    const line = document.createElement('span');
    line.className = 'vr';

    // Append all elements into wrapper
    const { time, moves, box } = this.elements;
    wrapper.append(time, line, moves, box);

    // Create pause button
    const button = document.createElement('button');
    button.textContent = 'Pause';

    // Build final element
    container.append(wrapper, button);

    // Put in newly build element
    this.element.innerHTML = '';
    this.element.appendChild(container);
  }

  reset(): void {
    // Clear stats
    this.stats.time = 0;
    this.stats.moves.box = 0;
    this.stats.moves.player = 0;
  }
}
