import LevelLayout from '../../models/LevelLayout';
import Vector from '../game-runner/models/Vector';
import getGridSize from '../game-runner/utils/getGridSize';
import Images from '../../game/Images';
import { getCellFromPosition, searchInLayout } from './utils/cellUtils';
import {
  BuilderTool,
  Tool,
  ToolHandlerResult,
  TransferorTool,
  TransferorToolHandlerResult,
} from './models/Tool';

export default class Editor {
  // Load assests
  private images: Map<string, HTMLImageElement> = Images.all;

  // Current tool
  private currentTool: Tool | undefined = undefined;

  // Grid dimensions
  private gridSize: Vector = { x: 10, y: 10 };

  // Get cell size
  private cellSize: number = getGridSize(
    { x: this.ctx.canvas.width, y: this.ctx.canvas.height },
    this.gridSize
  );

  // drag cell
  private startDragCell: Vector | undefined;
  private prevDragCell: Vector | undefined;

  // Ctx dimensions
  private canvasStartX: number = this.ctx.canvas.width / 2 - this.cellSize * (this.gridSize.x / 2);

  // Grid layout
  private layout: LevelLayout = {
    start: { x: 2, y: 2 },
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

  /** Updates size of level */
  updateDimensions() {
    // Calc cell size
    this.cellSize = getGridSize(
      { x: this.ctx.canvas.width, y: this.ctx.canvas.height },
      this.gridSize
    );

    // Calculate ctx offset on x
    this.canvasStartX = innerWidth / 2 - this.cellSize * (this.gridSize.x / 2);

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

    // Draw grid columns
    for (let i = 1; i < this.gridSize.x; i++) {
      this.ctx.moveTo(this.cellSize * i + this.canvasStartX, 0);
      this.ctx.lineTo(
        this.cellSize * i + this.canvasStartX,
        this.cellSize * this.gridSize.y + this.canvasStartX
      );
    }

    // draw grid rows
    for (let j = 1; j < this.gridSize.y; j++) {
      this.ctx.moveTo(this.canvasStartX, this.cellSize * j);
      this.ctx.lineTo(this.cellSize * this.gridSize.x + this.canvasStartX, this.cellSize * j);
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
      this.cellSize * cell.y + gap,
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
      this.cellSize * cell.y,
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
      { x: this.canvasStartX, y: 0 },
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
      y: this.selectionStart!.y,
    })!;

    const to = this.getCellFromPosition({
      x: Math.min(e.clientX, this.canvasStartX + this.gridSize.x * this.cellSize),
      y: e.clientY,
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
  seletionHandler(e: MouseEvent) {
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
