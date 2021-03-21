import LevelLayout from '../../../models/LevelLayout';
import Vector from '../../game-runner/models/Vector';
import { moveSelection, searchInLayout } from '../utils/cellUtils';
import { BuilderTool, TransferorTool } from './Tool';

export const BoxBuilder = new BuilderTool('Box builder', (layout: LevelLayout, cell: Vector) => {
  // If there is something on current cell just return layout
  if (searchInLayout(layout, cell)) return { layout, wasUpdated: false };
  // Otherwise add box on this cell
  layout.boxes.push(cell);
  // Return updated layout
  return { layout, wasUpdated: true };
});

/** Rubber tool */
export const Rubber = new BuilderTool('Rubber', (layout, cell) => {
  // Check if there is something to remove
  if (!searchInLayout(layout, cell)) return { layout, wasUpdated: false };

  // Clear this cell
  layout.boxes = layout.boxes.filter(position => position.x !== cell.x || position.y !== cell.y);
  layout.targets = layout.targets.filter(
    position => position.x !== cell.x || position.y !== cell.y
  );
  layout.walls = layout.walls.filter(position => position.x !== cell.x || position.y !== cell.y);

  // Return updated layout
  return { layout, wasUpdated: true };
});

/** Wall builder */
export const WallBuilder = new BuilderTool('Wall builder', (layout, cell) => {
  // If there is something on current cell just return layout
  if (searchInLayout(layout, cell)) return { layout, wasUpdated: false };

  // Otherwise add box on this cell
  layout.walls.push(cell);

  // Return updated layout
  return { layout, wasUpdated: true };
});

/** Target builder */
export const TargetBuilder = new BuilderTool('Target builder', (layout, cell) => {
  // If there is something on current cell just return layout
  if (searchInLayout(layout, cell)) return { layout, wasUpdated: false };

  // Otherwise add target to this cell
  layout.targets.push(cell);

  // Return updated layout
  return { layout, wasUpdated: true };
});

export const ElementsTransferor = new TransferorTool(
  'move',
  (layout, selection, prevCell, currentCell) => {
    // If previous cell is the same as current cell return unmodified layout
    if (!prevCell || (prevCell.x === currentCell.x && prevCell.y === currentCell.y))
      return { layout, wasUpdated: false, selection };

    // Get selection shift
    const shift = { x: currentCell.x - prevCell.x, y: currentCell.y - prevCell.y };

    const fullLayout = [...layout.boxes, ...layout.targets, ...layout.walls, layout.start];

    for (let i = 0; i < selection.length; i++) {
      // Find potential collision
      const collision = fullLayout.find(
        element => element.x === selection[i].x + shift.x && element.y === selection[i].y + shift.y
      );

      // Check if collision exists and if collision element is not selected
      if (
        collision &&
        selection.findIndex(element => element.x === collision.x && element.y === collision.y) ===
          -1
      ) {
        return { layout, wasUpdated: false, selection };
      }
    }

    // Move all boxes
    layout.boxes = moveSelection(layout.boxes, selection, shift);
    // Move all walls
    layout.walls = moveSelection(layout.walls, selection, shift);
    // Move all targets
    layout.targets = moveSelection(layout.targets, selection, shift);
    // Move start
    layout.start = moveSelection([layout.start], selection, shift)[0];

    // Move selection
    selection = selection.map(element => ({ x: element.x + shift.x, y: element.y + shift.y }));

    // Return moified layout
    return { layout, wasUpdated: true, selection };
  }
);
