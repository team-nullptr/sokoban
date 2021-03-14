import Layer from '../models/Layer';
import ListItem from '../models/ListItem';

export default class ListLayer extends Layer {
  element = document.createElement('section');

  private items: ListItem[] = [];
  private onclick?: (index: number) => void;

  set({ items, onclick }: { items?: ListItem[]; onclick?: (index: number) => void }) {
    if (items) this.items = items;
    if (onclick) this.onclick = onclick;
  }

  render(): void {
    this.element.className = 'list';

    // Create responsive container
    const container = document.createElement('div');
    container.className = 'container';

    // Create a list
    const list = document.createElement('ul');
    list.className = 'list';

    this.items.forEach((item, i) => {
      // Create li element
      const entry = document.createElement('li');

      // Add on click event listener
      entry.addEventListener('click', () => {
        if (this.onclick) this.onclick(i);
      });

      // Create a main part
      const main = document.createElement('div');
      main.className = 'main';

      // Create title element
      const title = document.createElement('p');
      title.innerHTML = item.title;
      title.className = 'title';
      main.appendChild(title);

      // If description was provided, create an element for it
      if (item.description) {
        const description = document.createElement('p');
        description.innerHTML = item.description;
        description.className = 'description';
        main.appendChild(description);
      }

      // Create sidebar element
      const sidebar = document.createElement('div');
      sidebar.className = 'sidebar';

      // If badge was provided, create an element for it
      if (item.badge) {
        const badge = document.createElement('p');
        badge.innerHTML = item.badge;
        badge.className = 'badge';
        sidebar.appendChild(badge);
      }

      // If actions were provided, create list of them
      if (item.actions?.length) {
        // Create wrapper for action buttons
        const wrapper = document.createElement('div');
        wrapper.className = 'actions';

        // Create a list of elements
        const actions = document.createElement('ul');

        // For every action, create an entry
        item.actions.forEach((action, i, arr) => {
          // Create li element
          const li = document.createElement('li');
          li.textContent = action;

          // Add event listener
          li.addEventListener('click', e => {
            e.stopPropagation(); // Prevent clicking on parent (the whole card)
            if (item.onactionclick) item.onactionclick(i);
          });

          // Append the entry to the list of actions
          actions.appendChild(li);

          // If the vertical line should be added, then create it
          if (i < arr.length - 1) {
            const li = document.createElement('li');

            const line = document.createElement('span');
            line.className = 'vr';

            li.appendChild(line);
            actions.appendChild(li);
          }
        });

        wrapper.appendChild(actions); // Append buttons to wrapper
        sidebar.appendChild(wrapper); // Append wrapper to sidebar
      }

      // Append main and sidebar to entry
      entry.append(main, sidebar);
      list.appendChild(entry);
    });

    // Compose new element
    this.element.innerHTML = '';
    container.appendChild(list);
    this.element.appendChild(container);
  }
}
