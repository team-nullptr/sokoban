import BoxToolIcon from '%assets%/icons/box.svg';
import WallToolIcon from '%assets%/icons/bricks.svg';
import TransferorToolIcon from '%assets%/icons/cursor.svg';
import RubberToolIcon from '%assets%/icons/eraser.svg';
import TargetToolIcon from '%assets%/icons/geo.svg';
import Sliders from '%assets%/icons/sliders.svg';

import Editor from '../../editor/Editor';
import { Tool } from '../../editor/classes/Tool';
import {
  BoxBuilder,
  ElementsTransferor,
  Rubber,
  TargetBuilder,
  WallBuilder,
} from '../../editor/models/Tools';
import Layer from '../models/Layer';
import EditorNavWidget from './EditorNavWidget';
import FormWidget from './FormWidget';

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

  // Form
  private form: FormWidget;

  // Widgets
  private editorNav: EditorNavWidget = new EditorNavWidget([
    [
      [
        {
          icon: { title: 'Box Builder', src: BoxToolIcon },
          handler: () => this.editor.setCurrentTool(BoxBuilder),
        },
        {
          icon: { title: 'Wall Builder', src: WallToolIcon },
          handler: () => this.editor.setCurrentTool(WallBuilder),
        },
        {
          icon: { title: 'Target Builder', src: TargetToolIcon },
          handler: () => this.editor.setCurrentTool(TargetBuilder),
        },
        {
          icon: { title: 'Rubber', src: RubberToolIcon },
          handler: () => this.editor.setCurrentTool(Rubber),
        },
        {
          icon: { title: 'Transferor', src: TransferorToolIcon },
          handler: () => this.editor.setCurrentTool(ElementsTransferor),
        },
      ],
    ],
    [
      [
        {
          icon: { title: 'Resize', src: Sliders },
          handler: () => this.form.open(),
          action: true,
        },
      ],
    ],
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

    // Create form
    this.form = new FormWidget([
      { name: 'width', type: 'number', min: 2 },
      { name: 'height', type: 'number', min: 2 },
    ]);

    // Subscribe for form submit and change size of grid
    this.form.subscribe<{ width: string; height: string }>(data => {
      if (data.width === '') data.width = '1';
      if (data.height === '') data.height = '1';
      this.editor.updateGridSize({ x: parseInt(data.width), y: parseInt(data.height) });
    });

    // Render form
    this.form.render();

    // Resize
    this.canvasResize();
    addEventListener('resize', this.canvasResize.bind(this));

    // init
    this.init();
    this.editorNav.render();
  }

  /** Init */
  private init() {
    // Prevent opening of browser context menu
    document.addEventListener('contextmenu', e => {
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
        this.editor.onCellDragStart(e);
        this.editor.onCellDrag(e);
      }
    });

    // Remove events on mouseenter
    this.canvas.addEventListener('mouseenter', e => {
      this.isDragging = false;
      this.isSelecting = false;
    });

    // Clear selection when user goes outside
    this.canvas.addEventListener('mouseleave', () => this.editor.clearSelection());

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
        this.editor.onCellDragStart(e);
        this.editor.onSelectionEnd(e);
      } else {
        this.isDragging = false;
      }
    });
  }

  /** Resize canvas */
  private canvasResize() {
    // Get new height and width
    const height = innerHeight;
    const width = innerWidth - 60;

    // Resize canvas
    this.canvas.height = height;
    this.canvas.width = width;
    this.uiCanvas.height = height;
    this.uiCanvas.width = width;

    // Draw grid
    this.editor.updateDimensions();
  }

  render(): void {
    this.element.classList.add('editor');

    // Set class for ui canvas
    this.uiCanvas.classList.add('event-layer');

    const editorContainer = document.createElement('section');
    editorContainer.classList.add('editor-container');

    // Attach all widgets to parent element
    this.element.appendChild(this.editorNav.element);

    this.canvas.classList.add('editor-canvas');

    // Attach canvas
    editorContainer.appendChild(this.canvas);
    editorContainer.appendChild(this.uiCanvas);
    this.element.appendChild(editorContainer);

    // Attach form
    this.element.appendChild(this.form.element);
  }
}
