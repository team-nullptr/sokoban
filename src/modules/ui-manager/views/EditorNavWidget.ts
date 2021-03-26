import { Tool } from '../../editor/classes/Tool';
import Layer from '../models/Layer';

export enum EditorNavEvents {
  TOOL_SELECTION,
  GRID_SIZE_TOGGLE,
}

type ToolSubscriber = (value: Tool) => void;

export default class EditorNavWidget extends Layer {
  element = document.createElement('nav');

  // Subscribers
  private toolSubscribers: ToolSubscriber[] = [];
  private toggleGridSizeSubscribers: (() => {})[] = [];

  // Widgets

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
    const listElements = document.querySelectorAll('.editor-menu-element');

    // Clear selected class on nav elements
    listElements.forEach(element => {
      element.classList.remove('editor-menu-element--selected');
    });

    // Add selected class list on clicked nav element
    element.classList.add('editor-menu-element--selected');

    // Notify tool selection subscribers
    this.notify(EditorNavEvents.TOOL_SELECTION, tool);
  }

  private createToolList() {
    // Create unordered list
    const ul = document.createElement('ul');
    ul.classList.add('editor-menu');

    // Create nav items for each tool
    this.tools.forEach(tool => {
      // Create list item
      const li = document.createElement('li');
      li.classList.add('editor-menu-element');

      // Notify all subscribers about new tool being selected
      li.addEventListener('click', () => this.onToolClick(li, tool));

      // Create element for tool name
      const icon = document.createElement('img');
      icon.classList.add('editor-menu-element__icon');
      icon.src = tool.iconPath;

      // Append title to list item and item to list
      li.appendChild(icon);
      ul.appendChild(li);
    });

    const resizeTool = document.createElement('li');
    resizeTool.classList.add('editor-menu-element');
    resizeTool.innerHTML = 'r';
    resizeTool.addEventListener('click', () => this.notify(EditorNavEvents.GRID_SIZE_TOGGLE, null));

    ul.appendChild(resizeTool);

    return ul;
  }

  render() {
    this.element.classList.add('editor-nav');
    this.element.appendChild(this.createToolList());
  }
}
