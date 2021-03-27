import Layer from '../models/Layer';
import NamedIcon from '../models/NamedItem';

/** Builds list item for given tool */
function buildTool(tool: NamedIcon, handler: (element: HTMLLIElement) => void) {
  // Create list item
  const li = document.createElement('li');
  li.className = 'editor-menu-element';

  // Add click event listener
  li.addEventListener('click', () => handler(li));

  // Create element for tool icon
  const icon = document.createElement('img');
  icon.className = 'editor-menu-element__icon';
  icon.src = tool.src;

  // Append the icon to list item
  li.appendChild(icon);

  return li;
}

interface EditorNavWidgetElement {
  icon: NamedIcon;
  handler: Function;
  action?: boolean;
}

export default class EditorNavWidget extends Layer {
  element = document.createElement('nav');

  constructor(private elements: EditorNavWidgetElement[][]) {
    super();
  }

  private selectField(element: HTMLElement) {
    // Get nav elements
    const listElements = document.querySelectorAll('.editor-menu-element');

    // Clear selected class on nav elements
    listElements.forEach(element => {
      element.classList.remove('editor-menu-element--selected');
    });

    // Add selected class list on clicked nav element
    element.classList.add('editor-menu-element--selected');
  }

  private createToolList() {
    // Create unordered list
    const ul = document.createElement('ul');
    ul.classList.add('editor-menu');

    this.elements.forEach((section, i) => {
      section.forEach(element => {
        // Get icon name and src
        const { title, src } = element.icon;

        if (element.action) {
          // Generate tool
          const li = buildTool({ title, src }, () => element.handler());

          // Add li to nav
          ul.appendChild(li);
        } else {
          // Generate tool li
          const li = buildTool({ title, src }, li => {
            // Select current tool
            this.selectField(li);
            // Call handler
            element.handler();
          });

          // Append tool to nav
          ul.appendChild(li);
        }
      });

      if (i < this.elements.length - 1) {
        const spacer = document.createElement('li');
        spacer.classList.add('spacer');
        ul.appendChild(spacer);
      }
    });

    return ul;
  }

  render() {
    this.element.classList.add('editor-nav');
    this.element.appendChild(this.createToolList());
  }
}
