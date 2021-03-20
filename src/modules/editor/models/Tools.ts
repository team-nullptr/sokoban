import LevelLayout from '../../../models/LevelLayout';
import Vector from '../../game-runner/models/Vector';
import { moveElement, searchInLayout } from '../utils/cellUtils';
import { BuilderTool, TransferorTool } from './Tool';

export const BoxBuilder = new BuilderTool('Box builder', (layout: LevelLayout, cell: Vector) => {
  // If there is something on current cell just return layout
  if (searchInLayout(layout, cell)) return [layout, false];
  // Otherwise add box on this cell
  layout.boxes.push(cell);
  // Return updated layout
  return [layout, true];
});

/** Rubber tool */
export const Rubber = new BuilderTool('Rubber', (layout, cell) => {
  // Check if there is something to remove
  if (!searchInLayout(layout, cell)) return [layout, false];

  // Clear this cell
  layout.boxes = layout.boxes.filter(position => position.x !== cell.x || position.y !== cell.y);
  layout.targets = layout.targets.filter(
    position => position.x !== cell.x || position.y !== cell.y
  );
  layout.walls = layout.walls.filter(position => position.x !== cell.x || position.y !== cell.y);

  // Return updated layout
  return [layout, true];
});

/** Wall builder */
export const WallBuilder = new BuilderTool('Wall builder', (layout, cell) => {
  // If there is something on current cell just return layout
  if (searchInLayout(layout, cell)) return [layout, false];

  // Otherwise add box on this cell
  layout.walls.push(cell);

  // Return updated layout
  return [layout, true];
});

/** Target builder */
export const TargetBuilder = new BuilderTool('Target builder', (layout, cell) => {
  // If there is something on current cell just return layout
  if (searchInLayout(layout, cell)) return [layout, false];

  // Otherwise add target to this cell
  layout.targets.push(cell);

  // Return updated layout
  return [layout, true];
});

export const ElementsTransferor = new TransferorTool('move', (layout, prevCell, currentCell) => {
  // If previous cell is the same as current cell return unmodified layout
  if (!prevCell || (prevCell.x === currentCell.x && prevCell.y === currentCell.y))
    return [layout, false];

  // Modify boxes
  layout.boxes = moveElement(layout, layout.boxes, prevCell, currentCell);
  // Modify walls
  layout.walls = moveElement(layout, layout.walls, prevCell, currentCell);
  // Modify targets
  layout.targets = moveElement(layout, layout.targets, prevCell, currentCell);
  // Modify start position
  layout.start = moveElement(layout, [layout.start], prevCell, currentCell)[0];

  // Return moified layout
  return [layout, true];
});
