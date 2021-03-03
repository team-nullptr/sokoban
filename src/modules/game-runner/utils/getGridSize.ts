import Size from '../models/Size';

/**
 * Calculates grid size for given free space
 * @param available Available width and height in pixels
 * @param required Required width and height in tiles
 */
export default function getGridSize(available: Size, required: Size): number {
  let size = 0;

  // If values are other than 0...
  if (required.width && required.height) {
    // Calculate tile size in both directions
    const horizontal = available.width / required.width;
    const vertical = available.height / required.height;

    // Choose the smaller value, so the whole level can fit
    size = Math.min(horizontal, vertical);
  }

  return size;
}
