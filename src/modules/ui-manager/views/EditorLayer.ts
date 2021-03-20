import Layer from '../models/Layer';
import Editor from '../../editor/Editor';
import EditorNavWidget, { EditorNavEvents } from './EditorNavWidget';
import { Tool } from '../../editor/models/Tool';
import { BoxBuilder, WallBuilder, Rubber, TargetBuilder } from '../../editor/models/Tools';

export default class EditorLayer extends Layer {
  // Main element
  element: HTMLElement = document.createElement('section');

  // Advanced events
  private isDragging: boolean = false;
  private isSelecting: boolean = false;

  // Canvas utils
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private uiCanvas: HTMLCanvasElement;
  private uiCtx: CanvasRenderingContext2D;

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

    // Create canvas for main editor
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;

    // Create canvas for ui Layer
    this.uiCanvas = document.createElement('canvas');
    this.uiCtx = this.uiCanvas.getContext('2d')!;

    // Create new editor
    this.editor = new Editor(this.ctx, this.uiCtx);

    // Resize
    this.canvasResize();
    addEventListener('resize', this.canvasResize.bind(this));

    // init
    this.init();
    this.editorNav.render();
  }

  /** init */
  init() {
    this.canvas.addEventListener('contextmenu', e => {
      e.preventDefault();
    });

    // Set drag handler
    this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
      // Check if user is selecting or building
      if (e.button || e.ctrlKey) {
        this.isSelecting = true;
        this.editor.onSelectionStart(e);
      } else {
        this.isDragging = true;
        this.editor.onCellDrag(e);
      }
    });

    this.canvas.addEventListener('mouseenter', e => {
      this.isDragging = false;
      this.isSelecting = false;
    });

    // Call drag handler
    this.canvas.addEventListener('mousemove', e => {
      // If user is dragging call drag handler
      if (this.isDragging) this.editor.onCellDrag(e);
      else if (this.isSelecting) this.editor.seletionHandler(e);
    });

    // Remove drag handler
    this.canvas.addEventListener('mouseup', e => {
      // If user was selecting call selection end
      if (e.button || e.ctrlKey) {
        this.isSelecting = false;
        this.editor.onSelectionEnd(e);
      } else {
        this.isDragging = false;
      }
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
    const height = innerHeight / 2;
    const width = innerWidth;

    // Resize canvas
    this.canvas.height = height;
    this.canvas.width = width;
    this.uiCanvas.height = height;
    this.uiCanvas.width = width;

    // Draw grid
    this.editor.renderLevel();
  }

  render(): void {
    // Set styles for ui canvas
    this.uiCanvas.style.pointerEvents = 'none';
    this.uiCanvas.style.position = 'absolute';
    this.uiCanvas.style.top = '0';
    this.uiCanvas.style.left = '0';

    // Attach canvas
    this.element.appendChild(this.canvas);
    this.element.appendChild(this.uiCanvas);
    // Attach all widgets to parent element
    this.element.appendChild(this.editorNav.element);
  }
}
