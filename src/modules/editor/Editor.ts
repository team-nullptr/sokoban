import LevelLayout from '../../models/LevelLayout';
import Vector from '../game-runner/models/Vector';
import getGridSize from '../game-runner/utils/getGridSize';
import Images from '../../game/Images';
import { Tool } from './models/Tool';
import { getCellFromPosition } from './utils/getCellFromPosition';

export default class Editor {
  // Load assests
  private images = Images.all;

  // Current tool
  private currentTool: Tool | undefined = undefined;

  // Grid dimensions
  private gridSize: Vector = { x: 5, y: 5 };

  // Grid layout
  private layout: LevelLayout = {
    start: { x: 2, y: 2 },
    boxes: [],
    targets: [],
    walls: [],
  };

  // Getell size
  private cellSize: number = getGridSize(
    { x: this.ctx.canvas.width, y: this.ctx.canvas.height },
    this.gridSize
  );

  constructor(private ctx: CanvasRenderingContext2D) {
    Images.load();
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

        // Check if cell is box, and assign image for it
        const isBox = this.layout.boxes.find(pos => pos.x === x && pos.y === y);
        if (isBox) image = this.images.get('box');

        // If there is available image for this cell
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
   * Handles cell click
   * @param e MouseEvent
   */
  onCellClick(e: MouseEvent) {
    // Get cell vector from mouse position
    const cell = getCellFromPosition(
      { x: 0, y: 0 }, // Upper left corner
      this.gridSize, // Lower right corner
      { x: e.clientX, y: e.clientY }, // Eevnt position
      this.cellSize // Current cell size
    );

    if (cell && this.currentTool) {
      // Update current layout
      const updatedLayout = this.currentTool.handler(this.layout, cell);
      this.layout = updatedLayout;
      // Update elements on grid
      this.render();
    }
  }
}
