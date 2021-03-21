import LevelLayout from '../../../models/LevelLayout';
import Vector from '../../game-runner/models/Vector';
import { Tool, ToolHandlerResult } from './Tool';

export interface TransferorToolHandlerResult extends ToolHandlerResult {
  selection: Vector[];
}

// Type of transferor tool handler
type TransferorToolHandler = (
  layout: LevelLayout,
  selection: Vector[],
  prevCell: Vector | undefined,
  currentCell: Vector,
  gridSize: Vector
) => TransferorToolHandlerResult;

// Transferor tool class declaration
export class TransferorTool extends Tool {
  constructor(name: string, private handler: TransferorToolHandler) {
    super(name);
  }

  /**
   * Function which calls handler of tool
   * @param layout Level layout
   * @param prevCell Previous event cell
   * @param currentCell Current event cell
   * @returns Layout and boolean which indicates if layout was modified
   */
  use(
    layout: LevelLayout,
    selection: Vector[],
    prevCell: Vector | undefined,
    currentCell: Vector,
    gridSize: Vector
  ) {
    return this.handler(layout, selection, prevCell, currentCell, gridSize);
  }
}
