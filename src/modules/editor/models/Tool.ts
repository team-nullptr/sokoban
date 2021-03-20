import LevelLayout from '../../../models/LevelLayout';
import Vector from '../../game-runner/models/Vector';

// type of tool handler return value
export type ToolHandlerResult = [LevelLayout, boolean];

// Abstract class for tool
export abstract class Tool {
  constructor(public name: string) {}

  /**
   * Abstract declaration of tool use method
   * @param params params passed to use tool
   */
  abstract use(...params: any): ToolHandlerResult;
}

// Type of builder tool handler
type BuilderToolHandler = (layout: LevelLayout, cell: Vector) => ToolHandlerResult;

// Builder tool class declaration
export class BuilderTool extends Tool {
  constructor(name: string, private handler: BuilderToolHandler) {
    super(name);
  }

  /**
   * Function which calls handler of tool
   * @param layout Level layout
   * @param cell Event cell
   * @returns Layout and boolean which indicates if layout was modified
   */
  use(layout: LevelLayout, cell: Vector) {
    return this.handler(layout, cell);
  }
}

// Type of transferor tool handler
type TransferorToolHandler = (
  layout: LevelLayout,
  prevCell: Vector,
  currentCell: Vector
) => ToolHandlerResult;

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
  use(layout: LevelLayout, prevCell: Vector, currentCell: Vector) {
    return this.handler(layout, prevCell, currentCell);
  }
}