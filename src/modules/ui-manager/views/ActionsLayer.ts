import NamedIcon from '../models/ControlsItem';
import Layer from '../models/Layer';

export default class ActionsLayer extends Layer {
  element: HTMLElement = document.createElement('section');

  private options: NamedIcon[] = [];
  private onclick: (index: number) => void = () => {};

  set({ items, onclick }: { items?: NamedIcon[]; onclick?: (index: number) => void }) {
    if (items) this.options = items;
    if (onclick) this.onclick = onclick;

    this.render();
  }

  render(): void {
    this.element.className = 'actions';

    // Create buttons
    const buttons = this.options.map((option, i) => {
      // Create button
      const button = document.createElement('button');

      // Add event listener
      button.addEventListener('click', () => this.onclick(i));

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'wrapper';

      // Create wrapper structure
      const icon = document.createElement('img');
      icon.src = option.src;

      const title = document.createElement('p');
      title.textContent = option.title;

      // Build final element
      wrapper.append(icon, title);
      button.appendChild(wrapper);

      return button;
    });

    // Create wrapper for buttons
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    // Set buttons as content
    wrapper.append(...buttons);
    this.element.innerHTML = '';
    this.element.appendChild(wrapper);
  }
}
