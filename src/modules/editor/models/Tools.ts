import LevelLayout from '../../../models/LevelLayout';
import Vector from '../../game-runner/models/Vector';
import { Tool } from './Tool';

/**
 * checks if something is placed on specified cell
 *
 * @param layout layout
 * @param cell cell position
 * @returns boolean value if there is already something on that cell
 */
const searchInLayout = (layout: LevelLayout, cell: Vector) =>
  [...layout.boxes, ...layout.targets, ...layout.walls, layout.start].some(
    position => position.x === cell.x && position.y === cell.y
  );

export const BoxBuilder: Tool = {
  name: 'Box builder',
  handler: (layout, cell) => {
    // If there is something on current cell just return layout
    if (searchInLayout(layout, cell)) return layout;

    // Otherwise add box on this cell
    layout.boxes.push(cell);

    // Return updated layout
    return layout;
  },
};

export const Rubber: Tool = {
  name: 'Rubber',
  handler: (layout, cell) => {
    // Check if there is something to remove
    if (!searchInLayout(layout, cell)) return layout;

    // Clear this cell
    layout.boxes = layout.boxes.filter(position => position.x !== cell.x || position.y !== cell.y);
    layout.targets = layout.targets.filter(
      position => position.x !== cell.x || position.y !== cell.y
    );
    layout.walls = layout.walls.filter(position => position.x !== cell.x || position.y !== cell.y);

    // Return updated layout
    return layout;
  },
};

export const WallBuilder: Tool = {
  name: 'Wall builder',
  handler: (layout, cell) => {
    // If there is something on current cell just return layout
    if (searchInLayout(layout, cell)) return layout;

    // Otherwise add box on this cell
    layout.walls.push(cell);

    // Return updated layout
    return layout;
  },
};

export const TargetBuilder: Tool = {
  name: 'Target builder',
  handler: (layout, cell) => {
    // If there is something on current cell just return layout
    if (searchInLayout(layout, cell)) return layout;

    // Otherwise add target to this cell
    layout.targets.push(cell);

    // Return updated layout
    return layout;
  },
};
