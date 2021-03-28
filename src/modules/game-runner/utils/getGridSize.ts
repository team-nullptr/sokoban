import Vector from '../models/Vector';

/**
 * Calculates grid size for given free space
 * @param available Available width and height in pixels
 * @param required Required width and height in tiles
 */
export default function getGridSize(available: Vector, required: Vector): number {
  let size = 0;

  // If values are other than 0...
  if (required.x && required.y) {
    // Calculate tile size in both directions
    const horizontal = available.x / required.x;
    const vertical = available.y / required.y;

    // Choose the smaller value, so the whole level can fit
    size = Math.min(horizontal, vertical);
  }

  return size;
}
