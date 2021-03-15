import ControlsItem from '../models/ControlsItem';
import Layer from '../models/Layer';

/** Represents widget with controls displayed on pause screen */
export default class ControlsWidget extends Layer {
  element = document.createElement('nav');

  private items: ControlsItem[] = [];
  private onclick: (index: number) => void = () => {}; // Called when list elements are clicked

  set({ items, onclick }: { items?: ControlsItem[]; onclick?: () => void }) {
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
