import { Tool } from './Tool';

export const BoxPlacer: Tool = {
  name: 'Box placer',
  handler: (layout, cell) => {
    // IF there is a box on current cell just return layout
    if (layout.boxes.find(position => position.x === cell.x && position.y === cell.y))
      return layout;
    // Otherwise add box on this cell
    layout.boxes.push(cell);
    // Return updated layout
    return layout;
  },
};
