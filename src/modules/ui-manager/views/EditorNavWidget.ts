import { Tool } from '../../editor/classes/Tool';
import Layer from '../models/Layer';
import NamedIcon from '../models/NamedItem';

import Sliders from '%assets%/icons/sliders.svg';

export enum EditorNavEvents {
  TOOL_SELECTION,
  GRID_SIZE_TOGGLE,
}

type ToolSubscriber = (value: Tool) => void;

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

export default class EditorNavWidget extends Layer {
  element = document.createElement('nav');

  // Subscribers
  private toolSubscribers: ToolSubscriber[] = [];
  private toggleGridSizeSubscribers: (() => {})[] = [];

  constructor(private tools: Tool[]) {
    super();
  }

  /**
   * Notifies all subscribers who subscribe specific event
   * @param event type of event
   */
  private notify(event: EditorNavEvents, value: any): void {
    switch (event) {
      case EditorNavEvents.TOOL_SELECTION:
        // Call all subscribers
        this.toolSubscribers.forEach(handler => handler(value as Tool));
        break;
      case EditorNavEvents.GRID_SIZE_TOGGLE:
        this.toggleGridSizeSubscribers.forEach(handler => handler());
        break;
    }
  }

  /**
   * Allows to subscribe to specific event
   * @param event type of event
   * @param handler handler function
   */
  subscribe(event: EditorNavEvents, handler: Function): void {
    switch (event) {
      case EditorNavEvents.TOOL_SELECTION:
        this.toolSubscribers.push(handler as ToolSubscriber);
        break;
      case EditorNavEvents.GRID_SIZE_TOGGLE:
        this.toggleGridSizeSubscribers.push(handler as () => {});
        break;
    }
  }

  private onToolClick(element: HTMLElement, tool: Tool) {
    // Get nav elements
    const listElements = document.querySelectorAll('.editor > .toolbar li');

    // Clear selected class on nav elements
    listElements.forEach(element => element.classList.remove('active'));

    // Add selected class list on clicked nav element
    element.classList.add('active');

    // Notify tool selection subscribers
    this.notify(EditorNavEvents.TOOL_SELECTION, tool);
  }

  private createToolList() {
    // Create unordered list
    const ul = document.createElement('ul');

    // Create nav items for each tool
    this.tools.forEach(tool => {
      // Build new tool
      // and add an event listener, that notifies all subscribers about new tool being selected
      const { name: title, iconPath: src } = tool;
      const li = buildTool({ title, src }, li => this.onToolClick(li, tool));
      ul.appendChild(li);
    });

    const resizeTool = buildTool({ title: 'Resize', src: Sliders }, () =>
      this.notify(EditorNavEvents.GRID_SIZE_TOGGLE, null)
    );

    ul.appendChild(resizeTool);

    return ul;
  }

  render() {
    this.element.classList.add('toolbar');
    this.element.appendChild(this.createToolList());
  }
}
