import LevelLayout from '../../../models/LevelLayout';
import Vector from '../../game-runner/models/Vector';
import { Tool, ToolHandlerResult } from './Tool';

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
