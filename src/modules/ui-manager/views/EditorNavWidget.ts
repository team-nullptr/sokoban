import { Tool } from '../../editor/models/Tool';
import Layer from '../models/Layer';

export enum EditorNavEvents {
  TOOL_SELECTION,
}

type ToolSubscriber = (value: Tool) => void;

export default class EditorNavWidget extends Layer {
  element = document.createElement('nav');
  private toolSubscribers: ToolSubscriber[] = [];

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
   *
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

  render(): void {
    // Create unordered list
    const ul = document.createElement('ul');

    this.tools.forEach(tool => {
      // Create list item
      const li = document.createElement('li');

      // Notify all subscribers about new tool being selected
      li.addEventListener('click', () => {
        this.notify(EditorNavEvents.TOOL_SELECTION, tool);
      });

      // Create element for tool name
      const p = document.createElement('p');
      p.innerHTML = tool.name;

      // Append title to list item and item to list
      li.appendChild(p);
      ul.appendChild(li);
    });

    this.element.appendChild(ul);
  }
}
