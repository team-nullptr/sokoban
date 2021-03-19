import LevelLayout from '../../models/LevelLayout';
import Vector from '../game-runner/models/Vector';
import getGridSize from '../game-runner/utils/getGridSize';
import Images from '../../game/Images';
import { compareCells } from './utils/cellUtils';
import { Tool } from './models/Tool';
import { getCellFromPosition } from './utils/getCellFromPosition';

export default class Editor {
  // Load assests
  private images: Map<string, HTMLImageElement> = Images.all;

  // Current tool
  private currentTool: Tool | undefined = undefined;

  // Grid dimensions
  private gridSize: Vector = { x: 8, y: 10 };

  // Grid layout
  private layout: LevelLayout = {
    start: { x: 2, y: 2 },
    boxes: [],
    targets: [],
    walls: [],
  };

  // Editor drag
  private dragStartCell: Vector | undefined;
  private dragPrevCell: Vector | undefined;

  // Get cell size
  private cellSize: number = getGridSize(
    { x: this.ctx.canvas.width, y: this.ctx.canvas.height },
    this.gridSize
  );

  constructor(private ctx: CanvasRenderingContext2D) {
    // Load images
    Images.load().then(() => this.render());
  }

  /** Render grid and it's element */
  render() {
    this.ctx.clearRect(0, 0, innerWidth, innerHeight);
    this.renderGrid();
    this.renderElements();
  }

  /** Render grid rows and columns */
  private renderGrid() {
    this.cellSize = getGridSize(
      { x: this.ctx.canvas.width, y: this.ctx.canvas.height },
      this.gridSize
    );

    // Set color of line
    this.ctx.strokeStyle = '#888';

    // Draw grid columns
    for (let i = 1; i < this.gridSize.x; i++) {
      this.ctx.moveTo(this.cellSize * i, 0);
      this.ctx.lineTo(this.cellSize * i, this.cellSize * this.gridSize.y);
    }

    // draw grid rows
    for (let j = 1; j < this.gridSize.y; j++) {
      this.ctx.moveTo(0, this.cellSize * j);
      this.ctx.lineTo(this.cellSize * this.gridSize.x, this.cellSize * j);
    }

    // Add stroke to draw line
    this.ctx.stroke();
  }

  /** Renders image on grid */
  private renderCellImage(cell: Vector, image: HTMLImageElement) {
    const gap = 5;

    this.ctx.drawImage(
      image!,
      this.cellSize * cell.x + gap,
      this.cellSize * cell.y + gap,
      this.cellSize - gap * 2,
      this.cellSize - gap * 2
    );
  }

  /** Render grid elements */
  private renderElements() {
    for (let x = 0; x < this.gridSize.x; x++) {
      for (let y = 0; y < this.gridSize.y; y++) {
        // Image for this cell
        let image: undefined | HTMLImageElement;

        // Check for type of cell
        const isBox = this.layout.boxes.some(pos => pos.x === x && pos.y === y);
        const isWall = this.layout.walls.some(pos => pos.x === x && pos.y === y);
        const isTarget = this.layout.targets.some(pos => pos.x === x && pos.y === y);
        const isPlayer = this.layout.start.x == x && this.layout.start.y === y;

        // Get proper image
        if (isBox) image = this.images.get('box');
        else if (isWall) image = this.images.get('wall');
        else if (isPlayer) image = this.images.get('player-face');
        else if (isTarget) image = this.images.get('target');

        // If there is available image for this cell render it
        if (image) this.renderCellImage({ x, y }, image);
      }
    }
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
  private getCellFromEvent(e: MouseEvent) {
    return getCellFromPosition(
      { x: 0, y: 0 }, // Upper left corner
      this.gridSize, // Lower right corner
      { x: e.clientX, y: e.clientY }, // Eevnt position
      this.cellSize // Current cell size
    );
  }

  /**
   * Handles start of cell drag
   * @param e Mouse event
   */
  onCellDragStart(e: MouseEvent) {
    const cell = this.getCellFromEvent(e);
    this.dragStartCell = cell;
  }

  /**
   * Handles cell drag
   * @param e Moue event
   */
  onCellDrag(e: MouseEvent) {
    // Get event cell
    const cell = this.getCellFromEvent(e);

    if (!compareCells(cell, this.dragPrevCell) && cell && this.currentTool) {
      // Update current layout
      const [layout, wasUpdated] = this.currentTool.handler(this.layout, cell);

      // Check if layout was modified in order to prevent unnecessary rerenders
      if (wasUpdated) {
        this.layout = layout;
        // Update elements on grid
        this.render();
        // Set new prev cell
        this.dragPrevCell = cell;
        console.log('drag called');
      }
    }
  }
}
