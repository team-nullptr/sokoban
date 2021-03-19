import NamedIcon from '../models/ControlsItem';
import Layer from '../models/Layer';

type Item = NamedIcon & { locked: boolean };

/** Represents widget with controls displayed on pause screen */
export default class ControlsWidget extends Layer {
  element = document.createElement('nav');

  private items: Item[] = [];
  private onclick: (index: number) => void = () => {}; // Called when list elements are clicked

  set({ items, onclick }: { items?: Item[]; onclick?: () => void }) {
    if (items) {
      this.items = items;
      this.render();
    }

    if (onclick) {
      this.onclick = onclick;
    }
  }

  render(): void {
    // Create new list
    const ul = document.createElement('ul');

    // Create list items
    this.items.forEach((item, i) => {
      const li = document.createElement('li');
      li.addEventListener('click', () => this.onclick(i));

      // Add `locked` class if needed
      if (item.locked) {
        li.classList.add('locked');
      }

      const img = document.createElement('img');
      img.src = item.src;

      const p = document.createElement('p');
      p.textContent = item.title;

      // Build final list item
      li.append(img, p);
      ul.appendChild(li);
    });

    // Put the list inside the element
    this.element.innerHTML = '';
    this.element.appendChild(ul);
  }

  reset() {
    // Remove onclick handler
    this.onclick = () => {};
  }
}
