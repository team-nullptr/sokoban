import Layer from '../models/Layer';
import Editor from '../../editor/Editor';
import EditorNavWidget, { EditorNavEvents } from './EditorNavWidget';
import { Tool } from '../../editor/models/Tool';
import { BoxBuilder, WallBuilder, Rubber, TargetBuilder } from '../../editor/models/Tools';

export default class EditorLayer extends Layer {
  // Main element
  element: HTMLElement = document.createElement('section');

  // Advanced events
  private dragHandler: (e: MouseEvent) => void = () => {};
  private isDragging: boolean = false;

  // Canvas utils
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Editor
  private editor: Editor;

  // Widgets
  private editorNav: EditorNavWidget = new EditorNavWidget([
    BoxBuilder,
    WallBuilder,
    TargetBuilder,
    Rubber,
  ]);

  constructor() {
    super();

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;

    // Set editor
    this.editor = new Editor(this.ctx);
    this.dragHandler = this.editor.onCellDrag.bind(this.editor);

    // Resize
    this.canvasResize();
    addEventListener('resize', this.canvasResize.bind(this));

    // init
    this.init();
    this.editorNav.render();
  }

  /** init */
  init() {
    // Set drag handler
    this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
      // Check if user pressed left mouse button
      if (!e.button) {
        this.isDragging = true;
        this.editor.onCellDragStart(e);
        this.dragHandler(e);
      }
    });

    // Call drag handler
    this.canvas.addEventListener('mousemove', e => {
      // If user is dragging call drag handler
      if (this.isDragging) this.dragHandler(e);
    });

    // Remove drag handler
    this.canvas.addEventListener('mouseup', () => (this.isDragging = false));

    // Listen for tool change
    this.editorNav.subscribe(EditorNavEvents.TOOL_SELECTION, (tool: Tool) => {
      // Update editor's current tool
      this.editor.setCurrentTool(tool);
    });
  }

  /** Resize canvas */
  private canvasResize() {
    // Get new height and width
    const height = innerHeight / 2;
    const width = innerWidth;

    // Resize canvas
    this.canvas.height = height;
    this.canvas.width = width;

    // Draw grid
    this.editor.render();
  }

  render(): void {
    // Attach canvas
    this.element.appendChild(this.canvas);
    // Attach all widgets to parent element
    this.element.appendChild(this.editorNav.element);
  }
}
