import LevelLayout from '../../../models/LevelLayout';
import Vector from '../../game-runner/models/Vector';

// Tool interface
export interface Tool {
  name: string;
  handler: (layout: LevelLayout, cell: Vector) => [LevelLayout, boolean];
}
