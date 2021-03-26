import Layer from '../models/Layer';
import NamedIcon from '../models/NamedItem';

export interface MultifunctionalListItem {
  title: string;
  description?: string;
  onclick?: () => void;
  actions?: (NamedIcon & { onclick: () => void })[];
  highlighted?: boolean;
}

export default class MultifunctionalListLayer extends Layer {
  element = document.createElement('section');

  private items: MultifunctionalListItem[] = [];

  constructor(private readonly title: string) {
    super();
  }

  set(items: MultifunctionalListItem[]) {
    this.items = items;
    this.render();
  }

  render(): void {
    this.element.classList.add('multi-list');

    const entries = this.items.map(item => {
      const entry = document.createElement('div');
      entry.className = 'entry';

      // If action buttons were provided, create buttons
      if (item.actions) {
        // Create action buttons
        const actions = item.actions.map(action => {
          const icon = document.createElement('img');

          icon.src = action.src;
          icon.title = action.title;
          icon.addEventListener('click', e => {
            e.stopPropagation();
            action.onclick();
          });

          return icon;
        });

        // Wrapper for action buttons
        const actionsWrapper = document.createElement('div');
        actionsWrapper.className = 'actions-wrapper';
        actionsWrapper.append(...actions);

        entry.appendChild(actionsWrapper);
      }

      // Wrapper for title and description
      const textWrapper = document.createElement('div');
      textWrapper.classList.add('text-wrapper');

      // Create and fill title element
      const title = document.createElement('p');
      title.className = 'title';
      title.textContent = item.title;
      textWrapper.appendChild(title);

      // If description was provided, create coresponding element
      if (item.description) {
        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = item.description;
        textWrapper.appendChild(description);
      }

      // Build final element
      if (item.highlighted === true) entry.classList.add('highlighted');

      // Add event listener if provided, else add class 'locked'
      if (item.onclick) entry.addEventListener('click', item.onclick);
      else entry.classList.add('locked');

      entry.appendChild(textWrapper);

      return entry;
    });

    const container = document.createElement('div');
    container.classList.add('container');

    if (this.title) {
      const header = document.createElement('h2');
      header.textContent = this.title;
      container.appendChild(header);
    }

    container.append(...entries);

    this.element.innerHTML = '';
    this.element.appendChild(container);
  }
}
