import Layer from '../models/Layer';
import Editor from '../../editor/Editor';
import EditorNavWidget, { EditorNavEvents } from './EditorNavWidget';
import { Tool } from '../../editor/models/Tool';

export default class EditorLayer extends Layer {
  element: HTMLElement = document.createElement('section');

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private editor: Editor;
  private editorNav: EditorNavWidget = new EditorNavWidget([{ name: 'rubber' }]);

  constructor() {
    super();

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;

    // Set editor
    this.editor = new Editor(this.ctx);

    // Resize
    this.canvasResize();
    addEventListener('resize', this.canvasResize.bind(this));

    // init
    this.init();

    this.editorNav.render();
  }

  /** init */
  init() {
    // Listen for mouse down event on canvas
    this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
      this.editor.onCellClick(e);
    });

    // Listen for tool change
    this.editorNav.subscribe(EditorNavEvents.TOOL_SELECTION, (tool: Tool) => {
      // Update editor's current tool
      this.editor.setCurrentTool(tool);
    });
  }

  /** Resize canvas */
  private canvasResize() {
    // Get new height and width
    const height = innerHeight;
    const width = innerWidth;

    // Resize canvas
    this.canvas.height = height;
    this.canvas.width = width;

    // Draw grid
    this.editor.updateGrid();
  }

  render(): void {
    // Attach all widgets to parent element
    this.element.appendChild(this.editorNav.element);
    // Attach canvas
    this.element.appendChild(this.canvas);
  }
}
