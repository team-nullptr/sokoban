import NamedIcon from '../models/ControlsItem';
import Layer from '../models/Layer';

type Button = NamedIcon & { onclick: () => void };

export default class ActionButtonWidget extends Layer {
  element = document.createElement('button');

  private options?: Button;

  set(options: Button) {
    this.options = options;
    this.render();
  }

  render(): void {
    this.element.className = 'action';

    if (!this.options) return;

    // Add event listener
    this.element.addEventListener('click', this.options.onclick);

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    // Create wrapper structure
    const icon = document.createElement('img');
    icon.src = this.options.src;

    const title = document.createElement('p');
    title.textContent = this.options.title;

    // Build final element
    wrapper.append(icon, title);

    this.element.innerHTML = '';
    this.element.append(wrapper);
  }
}
