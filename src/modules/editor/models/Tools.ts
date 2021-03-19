import { searchInLayout } from '../utils/cellUtils';
import { Tool } from './Tool';

export const BoxBuilder: Tool = {
  name: 'Box builder',
  handler: (layout, cell) => {
    // If there is something on current cell just return layout
    if (searchInLayout(layout, cell)) return [layout, false];

    // Otherwise add box on this cell
    layout.boxes.push(cell);

    // Return updated layout
    return [layout, true];
  },
};

export const Rubber: Tool = {
  name: 'Rubber',
  handler: (layout, cell) => {
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
  },
};

export const WallBuilder: Tool = {
  name: 'Wall builder',
  handler: (layout, cell) => {
    // If there is something on current cell just return layout
    if (searchInLayout(layout, cell)) return [layout, false];

    // Otherwise add box on this cell
    layout.walls.push(cell);

    // Return updated layout
    return [layout, true];
  },
};

export const TargetBuilder: Tool = {
  name: 'Target builder',
  handler: (layout, cell) => {
    // If there is something on current cell just return layout
    if (searchInLayout(layout, cell)) return [layout, false];

    // Otherwise add target to this cell
    layout.targets.push(cell);

    // Return updated layout
    return [layout, true];
  },
};
