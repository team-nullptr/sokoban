import LevelLayout from '../../models/LevelLayout';
import Vector from '../game-runner/models/Vector';
import getGridSize from '../game-runner/utils/getGridSize';
import Images from '../../game/Images';
import { getCellFromPosition, searchInLayout } from './utils/cellUtils';
import { BuilderTool } from './classes/BuilderTool';
import { TransferorTool, TransferorToolHandlerResult } from './classes/TransferorTool';
import { Tool, ToolHandlerResult } from './classes/Tool';
import Level from '../../models/Level';
import { ElementsTransferor } from './models/Tools';

export default class Editor {
  // Load assests
  private images: Map<string, HTMLImageElement> = Images.all;

  // Current tool
  private currentTool: Tool | undefined = ElementsTransferor;

  // Grid dimensions
  private gridSize: Vector = { x: 10, y: 10 };

  // Get cell size
  private cellSize: number = getGridSize(
    { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2 },
    this.gridSize
  );

  // drag cell
  private prevDragCell: Vector | undefined;

  // Ctx dimensions
  private canvasStartX: number = this.ctx.canvas.width / 2 - this.cellSize * (this.gridSize.x / 2);
  private canvasStartY: number = this.ctx.canvas.height / 2 - this.cellSize * (this.gridSize.y / 2);

  // Grid layout
  private layout: LevelLayout = {
    start: { x: 0, y: 0 },
    boxes: [],
    targets: [],
    walls: [],
  };

  // selection
  private selectionStart: Vector | undefined;
  private selectedCells: Vector[] = [];

  constructor(private ctx: CanvasRenderingContext2D, private uiCtx: CanvasRenderingContext2D) {
    // Load images
    Images.load().then(() => this.renderLevel());
  }

  /** Returns meta of the level */
  get metaInfo() {
    return {
      layout: this.layout,
      size: this.gridSize,
    };
  }

  /** Clears current  */
  clear(): void {
    this.layout = {
      start: {
        x: this.layout.start.x <= this.gridSize.x ? this.layout.start.x : 0,
        y: this.layout.start.y <= this.gridSize.y ? this.layout.start.y : 0,
      },
      boxes: [],
      targets: [],
      walls: [],
    };

    this.updateDimensions();
  }

  /** Return level in required format */
  getLevel(): Level {
    return {
      width: this.gridSize.x,
      height: this.gridSize.y,
      boxes: this.layout.boxes,
      start: this.layout.start,
      walls: this.layout.walls,
      targets: this.layout.targets,
    };
  }

  /**
   * Allows for loading levels
   * @param level Level to load
   */
  loadLevel(level: Level) {
    // Set grid size
    this.updateGridSize({ x: level.width, y: level.height });

    // Update layout
    this.layout = {
      start: { x: level.start.x, y: level.start.y },
      boxes: level.boxes,
      walls: level.walls,
      targets: level.targets,
    };

    // Render level
    this.renderLevel();
  }

  private fitToEditorSize(elements: Vector[]) {
    return elements.filter(
      element =>
        element.x < this.gridSize.x &&
        element.y < this.gridSize.y &&
        (element.x !== this.layout.start.x || element.y !== this.layout.start.y)
    );
  }

  /**
   * Updates editor grid size
   * @param size Size of grid
   */
  updateGridSize(size: Vector) {
    // Update size of grid
    this.gridSize = size;

    // Check if current start can be unmodified
    this.layout.start =
      this.layout.start.x >= size.x && this.layout.start.y >= size.y
        ? { x: 0, y: 0 }
        : this.layout.start;

    // Filter boxes
    this.layout.boxes = this.fitToEditorSize(this.layout.boxes);
    this.layout.walls = this.fitToEditorSize(this.layout.walls);
    this.layout.targets = this.fitToEditorSize(this.layout.targets);

    this.updateDimensions();
  }

  /** Updates size of level */
  updateDimensions() {
    // Calc cell size
    this.cellSize = Math.min(
      getGridSize(
        { x: this.ctx.canvas.width / 1.5, y: this.ctx.canvas.height / 1.5 },
        this.gridSize
      ),
      70
    );

    // Calculate ctx offset on x
    this.canvasStartX = this.ctx.canvas.width / 2 - this.cellSize * (this.gridSize.x / 2);
    this.canvasStartY = this.ctx.canvas.height / 2 - this.cellSize * (this.gridSize.y / 2);

    // Render level
    this.renderLevel();
  }

  /** Render grid and it's element */
  private renderLevel() {
    // Clear grid
    this.ctx.clearRect(0, 0, innerWidth, innerHeight);

    // Render grid
    this.renderGrid();

    // Render elements
    this.renderElements(this.layout.boxes, 'box');
    this.renderElements(this.layout.targets, 'target');
    this.renderElements(this.layout.walls, 'wall');
    this.renderElements([this.layout.start], 'player-face');
  }

  /** Render grid rows and columns */
  private renderGrid() {
    // Set color of line
    this.ctx.strokeStyle = '#888';

    this.ctx.beginPath();

    // Draw grid columns
    for (let i = 1; i < this.gridSize.x; i++) {
      this.ctx.moveTo(this.cellSize * i + this.canvasStartX, this.canvasStartY);
      this.ctx.lineTo(
        this.cellSize * i + this.canvasStartX,
        this.cellSize * this.gridSize.y + this.canvasStartY
      );
    }

    // draw grid rows
    for (let j = 1; j < this.gridSize.y; j++) {
      this.ctx.moveTo(this.canvasStartX, this.cellSize * j + this.canvasStartY);
      this.ctx.lineTo(
        this.cellSize * this.gridSize.x + this.canvasStartX,
        this.cellSize * j + this.canvasStartY
      );
    }

    // Add stroke to draw line
    this.ctx.stroke();
  }

  /** Renders image on grid */
  private renderCellImage(cell: Vector, image: HTMLImageElement) {
    const gap = 5;

    // Draw image on canvas
    this.ctx.drawImage(
      image!,
      this.cellSize * cell.x + gap + this.canvasStartX,
      this.cellSize * cell.y + gap + this.canvasStartY,
      this.cellSize - gap * 2,
      this.cellSize - gap * 2
    );
  }

  /**
   * Renders selected cell background
   * @param cell Vector of cell
   */
  private renderSelectedCell(cell: Vector) {
    // Set color
    this.ctx.fillStyle = 'rgba(161, 232, 255, 0.5)';
    // Render background for cell
    this.ctx.fillRect(
      this.cellSize * cell.x + this.canvasStartX,
      this.cellSize * cell.y + this.canvasStartY,
      this.cellSize,
      this.cellSize
    );
  }

  /** Render grid elements */
  private renderElements(elements: Vector[], assetKey: string) {
    elements.forEach(element => {
      // Get image for element
      const image = this.images.get(assetKey);

      // Render image
      if (image) this.renderCellImage(element, image);

      for (let i = 0; i < this.selectedCells.length; i++) {
        if (element.x === this.selectedCells[i].x && element.y === this.selectedCells[i].y)
          this.renderSelectedCell(this.selectedCells[i]);
      }
    });
  }

  /**
   * Sets new editor's current tool
   * @param tool new current tool
   */
  setCurrentTool(tool: Tool) {
    // Set new current tool
    this.currentTool = tool;
  }

  /**
   * Get's cell from mouse event
   * @param e Mouse event
   * @returns Vector of cell position
   */
  private getCellFromPosition(pos: Vector) {
    // Run util function for getting cell from position
    return getCellFromPosition(
      { x: this.canvasStartX + this.ctx.canvas.parentElement!.offsetLeft, y: this.canvasStartY },
      { x: pos.x, y: pos.y },
      this.gridSize,
      this.cellSize
    );
  }

  /**
   * Handles start of selection
   * @param e Mouse event
   */
  onSelectionStart(e: MouseEvent) {
    // Set drag start
    this.selectionStart = { x: e.clientX, y: e.clientY };
  }

  /** Clear selection */
  clearSelection() {
    // Clear
    this.uiCtx.clearRect(0, 0, innerWidth, innerHeight);
  }

  /**
   * Handles selection end
   * @param e Mouse eevent
   */
  onSelectionEnd(e: MouseEvent) {
    // Remvoe selected fields
    this.selectedCells = [];

    // Get selection bounds
    const from = this.getCellFromPosition({
      x: Math.max(this.selectionStart!.x, this.canvasStartX),
      y: Math.max(this.selectionStart!.y, this.canvasStartY),
    })!;

    const to = this.getCellFromPosition({
      x: Math.min(
        e.clientX,
        this.canvasStartX +
          this.ctx.canvas.parentElement!.offsetLeft +
          this.gridSize.x * this.cellSize
      ),
      y: Math.min(e.clientY, this.canvasStartY + this.gridSize.y * this.cellSize),
    })!;

    // Generate selection based on it's bounds
    if (to && from)
      for (let x = Math.min(from.x, to.x); x <= Math.max(from.x, to.x); x++) {
        for (let y = Math.min(from.y, to.y); y <= Math.max(from.y, to.y); y++) {
          // Add selected cell if there is something on this cell
          if (searchInLayout(this.layout, { x, y })) this.selectedCells.push({ x, y });
        }
      }

    // Clear ui canvas
    this.uiCtx.clearRect(0, 0, innerWidth, innerHeight);

    // Rerender level
    this.renderLevel();
  }

  /**
   * Handles selection
   * @param e Mouse event
   */
  selectionHandler(e: MouseEvent) {
    // Clear canvas
    this.uiCtx.clearRect(0, 0, innerWidth, innerHeight);

    // Set styles for selection rectangle
    this.uiCtx.fillStyle = '#84b9e8';
    this.uiCtx.globalAlpha = 0.4;

    // Render rectangle
    this.uiCtx.fillRect(
      this.selectionStart!.x,
      this.selectionStart!.y,
      e.clientX - this.selectionStart!.x,
      e.clientY - this.selectionStart!.y
    );

    // Set context alpha
    this.uiCtx.globalAlpha = 1;
  }

  /**
   * On cell drag start
   * @param e Mouse event
   */
  onCellDragStart(e: MouseEvent) {
    // Get event cell
    const cell = this.getCellFromPosition({ x: e.clientX, y: e.clientY });
    // Set previous cell to undefined
    this.prevDragCell = cell;
  }

  /**
   * Handles cell drag
   * @param e Moue event
   */
  onCellDrag(e: MouseEvent) {
    // Get event cell
    const cell = this.getCellFromPosition({ x: e.clientX, y: e.clientY });

    if (cell && this.currentTool) {
      // Declare variable for tool result
      let result: ToolHandlerResult;

      // Get instance of current tools
      const toolType = this.currentTool.constructor;

      // Check for tool types
      if (toolType === BuilderTool) {
        this.selectedCells = [];
        result = (this.currentTool as BuilderTool).use(this.layout, cell);
      } else if (toolType === TransferorTool) {
        result = (this.currentTool as TransferorTool).use(
          this.layout,
          this.selectedCells,
          this.prevDragCell,
          cell,
          this.gridSize
        );
        this.selectedCells = (result as TransferorToolHandlerResult).selection;
      }

      // Get result values
      const { layout, wasUpdated } = result!;

      // Check if layout was modified in order to prevent unnecessary rerenders
      if (wasUpdated!) {
        // Update current layout
        this.layout = layout!;
        // Update elements on grid
        this.renderLevel();
        // Update previous cell
        this.prevDragCell = cell;
      }
    }
  }
}
