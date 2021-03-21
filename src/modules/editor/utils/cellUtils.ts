import Level from '../../../models/Level';
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

export const checkTransform = (
  layout: LevelLayout,
  selection: Vector[],
  shift: Vector,
  gridSize: Vector
) => {
  const fullLayout = [...layout.boxes, ...layout.targets, ...layout.walls, layout.start];

  for (let i = 0; i < selection.length; i++) {
    // Find potential collision
    const collision = fullLayout.find(
      element => element.x === selection[i].x + shift.x && element.y === selection[i].y + shift.y
    );

    // Check if collision exists and if collision element is not selected
    if (
      (collision &&
        selection.findIndex(element => element.x === collision.x && element.y === collision.y) ===
          -1) ||
      selection[i].x + shift.x > gridSize.x - 1 ||
      selection[i].y + shift.y > gridSize.y - 1 ||
      selection[i].x + shift.x < 0 ||
      selection[i].y + shift.y < 0
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Moves elements on level by provided vector
 * @param elements level elements
 * @param selection selected elements
 * @param shift transfer vector
 * @returns elements with modified position
 */
export const moveSelection = (elements: Vector[], selection: Vector[], shift: Vector) => {
  // Create copy of elements and selection
  const unmodifiedElements = [...elements];

  // Find selected cell in layout elements (Can be done faster)
  for (let i = 0; i < unmodifiedElements.length; i++) {
    for (let j = 0; j < selection.length; j++) {
      if (compareCells(unmodifiedElements[i], selection[j])) {
        // Get destination
        const dest = { x: unmodifiedElements[i].x + shift.x, y: unmodifiedElements[i].y + shift.y };
        // Update elements and selection
        elements[i] = dest;
      }
    }
  }

  // Return new elements and selection
  return elements;
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

/**
 * Returns grid cell based on event position in px
 *
 * @param gridStart Vector of grid's left up corner
 * @param gridDim Vector of grid size
 * @param eventPos Vector of event position
 * @param cellSize Size of a cell
 */
export const getCellFromPosition = (
  gridStart: Vector,
  eventPos: Vector,
  gridDim: Vector,
  cellSize: number
): Vector | undefined => {
  // Check if event took place on grid
  if (
    eventPos.x < gridStart.x ||
    eventPos.y < gridStart.y ||
    cellSize * gridDim.x + gridStart.x < eventPos.x ||
    cellSize * gridDim.y + gridStart.y < eventPos.y
  ) {
    return undefined;
  }

  // Get distance from left and top of a grid
  const offsetX = eventPos.x - gridStart.x;
  const offsetY = eventPos.y - gridStart.y;

  // Calculate grid x and y position
  const cellX = Math.floor(offsetX / cellSize);
  const cellY = Math.floor(offsetY / cellSize);

  // Return vector
  return {
    x: cellX,
    y: cellY,
  };
};
