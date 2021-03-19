import LevelLayout from '../../../models/LevelLayout';
import Vector from '../../game-runner/models/Vector';

/**
 * Compares two cells
 * @param cellA first cell
 * @param cellB second cell
 * @returns true if cells are the same, false otherwise
 */
export const compareCells = (cellA: Vector | undefined, cellB: Vector | undefined) => {
  if (cellA && cellB) return cellA.x === cellB.x && cellA.y === cellB.y;
  return false;
};

/**
 * Checks if cell is used in layout
 * @param layout Level layout
 * @param cell cell
 * @returns boolean if cell is used in layout
 */
export const searchInLayout = (layout: LevelLayout, cell: Vector | undefined) => {
  // Merge layout cells
  const fullLayout = [...layout.boxes, ...layout.targets, ...layout.walls, layout.start];

  // Check if cell is in layout
  for (let i = 0; i < fullLayout.length; i++) {
    if (compareCells(fullLayout[i], cell)) return true;
  }

  // This cell is not in layout
  return false;
};
