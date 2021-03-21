import LevelLayout from '../../../models/LevelLayout';

// type of tool handler return value
export interface ToolHandlerResult {
  layout: LevelLayout;
  wasUpdated: boolean;
}

// Abstract class for tool
export abstract class Tool {
  constructor(public name: string) {}

  /**
   * Abstract declaration of tool use method
   * @param params params passed to use tool
   */
  abstract use(...params: any): ToolHandlerResult;
}
