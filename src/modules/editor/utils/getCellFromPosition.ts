import Vector from '../../game-runner/models/Vector';

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
  gridDim: Vector,
  eventPos: Vector,
  cellSize: number
): Vector | undefined => {
  // Get distance from left and top of a grid
  const offsetX = eventPos.x - gridStart.x;
  const offsetY = eventPos.y - gridStart.y;

  // Check if event took place on grid
  if (
    offsetX < 0 ||
    offsetY < 0 ||
    cellSize * gridDim.x + gridStart.x < offsetX ||
    cellSize * gridDim.y + gridStart.y < offsetY
  ) {
    return undefined;
  }

  // Calculate grid x and y position
  const cellX = Math.floor(offsetX / cellSize);
  const cellY = Math.floor(offsetY / cellSize);

  // Return vector
  return {
    x: cellX,
    y: cellY,
  };
};
