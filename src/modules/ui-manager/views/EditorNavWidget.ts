import FormWidget from './FormWidget';
import { Tool } from '../../editor/classes/Tool';
import Vector from '../../game-runner/models/Vector';
import Layer from '../models/Layer';

export enum EditorNavEvents {
  TOOL_SELECTION,
  GRID_SIZE_CHANGE,
}

type ToolSubscriber = (value: Tool) => void;
type GridSizeSubscriber = (value: Vector) => void;

export default class EditorNavWidget extends Layer {
  element = document.createElement('section');

  // Subscribers
  private toolSubscribers: ToolSubscriber[] = [];

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

  private createNav() {
    // Create nav
    const nav = document.createElement('nav');

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
      const p = document.createElement('p');
      p.innerHTML = tool.name;

      // Append title to list item and item to list
      li.appendChild(p);
      ul.appendChild(li);
    });

    nav.appendChild(ul);
    return nav;
  }

  render() {
    this.element.appendChild(this.createNav());
  }
}
