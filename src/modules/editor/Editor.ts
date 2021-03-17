import getGridSize from '../game-runner/utils/getGridSize';
import EditorNavWidget from '../ui-manager/views/EditorNavWidget';
import { Tool } from './models/Tool';
import { getCellFromPosition } from './utils/getCellFromPosition';

export default class Editor {
  private currentTool: Tool | undefined = undefined;
  private gridWidth: number = 5;
  private gridHeight: number = 5;
  private cellSize: number = getGridSize(
    { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2 },
    { x: this.gridWidth, y: this.gridHeight }
  );

  constructor(private ctx: CanvasRenderingContext2D) {}

  /** updates grid */
  updateGrid() {
    // Get cell
    this.cellSize = getGridSize(
      { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2 },
      { x: this.gridWidth, y: this.gridHeight }
    );

    // Set color of line
    this.ctx.strokeStyle = '#888';

    // Draw grid columns
    for (let i = 1; i < this.gridWidth; i++) {
      this.ctx.moveTo(this.cellSize * i, 0);
      this.ctx.lineTo(this.cellSize * i, this.cellSize * this.gridHeight);

      // draw grid rows
      for (let j = 1; j < this.gridHeight; j++) {
        this.ctx.moveTo(0, this.cellSize * j);
        this.ctx.lineTo(this.cellSize * this.gridWidth, this.cellSize * j);
      }
    }

    // Add stroke to draw line
    this.ctx.stroke();
  }

  /**
   * Sets new editor's current tool
   *
   * @param tool new current tool
   */
  setCurrentTool(tool: Tool) {
    // Set new current tool
    this.currentTool = tool;
  }

  /**
   * handles cell click
   * @param e MouseEvent
   */
  onCellClick(e: MouseEvent) {
    // Get cell vector from mouse position
    const cell = getCellFromPosition(
      { x: 0, y: 0 },
      { x: this.gridWidth, y: this.gridHeight },
      { x: e.clientX, y: e.clientY },
      this.cellSize
    );

    console.log('Using tool', this.currentTool, 'on cell', cell);
  }
}
