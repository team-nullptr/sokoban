import Layer from '../models/Layer';
import NamedIcon from '../models/NamedItem';

interface MultifunctionalListItem {
  title: string;
  description: string;
  onclick: () => void;
  actions: (NamedIcon & { onclick: () => void })[];
  highlighted?: boolean;
}

export default class MultifunctionalListLayer extends Layer {
  element = document.createElement('section');

  private items: MultifunctionalListItem[] = [];

  set(items: MultifunctionalListItem[]) {
    this.items = items;
  }

  render(): void {
    this.element.className = 'multi-list';

    const entries = this.items.map(item => {
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

      // Wrapper for title and description
      const textWrapper = document.createElement('div');
      textWrapper.classList.add('text-wrapper');

      // Create and fill title and description elements
      const title = document.createElement('p');
      title.className = 'title';
      title.textContent = item.title;

      const description = document.createElement('p');
      description.className = 'description';
      description.textContent = item.description;

      // Append title and description to wrapper
      textWrapper.append(title, description);

      // Build final element
      const entry = document.createElement('div');
      entry.className = 'entry';
      if (item.highlighted === true) entry.classList.add('highlighted');
      entry.addEventListener('click', item.onclick);

      entry.append(actionsWrapper, textWrapper);

      return entry;
    });

    this.element.innerHTML = '';
    this.element.append(...entries);
  }
}
