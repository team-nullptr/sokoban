import Layer from '../models/Layer';
import NamedIcon from '../models/NamedItem';

/** Builds list item for given tool */
function buildTool(tool: NamedIcon, handler: (element: HTMLLIElement) => void) {
  // Create list item
  const li = document.createElement('li');

  // Add click event listener
  li.addEventListener('click', () => handler(li));

  // Create element for tool icon
  const icon = document.createElement('img');
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

  constructor(private elements: EditorNavWidgetElement[][][]) {
    super();
  }

  private selectField(element: HTMLElement) {
    // Get nav elements
    const listElements = document.querySelectorAll('.editor > .toolbar li');

    // Clear selected class on nav elements
    listElements.forEach(element => element.classList.remove('active'));

    // Add selected class list on clicked nav element
    element.classList.add('active');
  }

  private createToolList() {
    // Create unordered list
    const ul = document.createElement('ul');

    this.elements.forEach((section, i) => {
      section.forEach((group, j) => {
        group.forEach(element => {
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

        // Create separator between groups
        if (j < section.length - 1) {
          const separator = document.createElement('hr');
          ul.appendChild(separator);
        }
      });

      // Create spacer between sections
      if (i < this.elements.length - 1) {
        const spacer = document.createElement('li');
        spacer.classList.add('spacer');
        ul.appendChild(spacer);
      }
    });

    return ul;
  }

  render() {
    this.element.classList.add('toolbar');
    this.element.appendChild(this.createToolList());
  }
}
