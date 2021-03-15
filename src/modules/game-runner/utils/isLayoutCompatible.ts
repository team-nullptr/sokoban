import Level from '../../../models/Level';
import LevelLayout from '../../../models/LevelLayout';

/**
 * Checks if given layout is compatible with given level
 * @param layout
 * @param level
 */
export default function isLayoutCompatible(layout: LevelLayout, level: Level): boolean {
  // Check if levels are the same size
  if (
    layout.boxes.length !== level.boxes.length ||
    layout.targets.length !== level.targets.length ||
    layout.walls.length !== level.walls.length
  )
    return false;

  // Check if new given layout can fit in level
  return [layout.start, ...layout.boxes, ...layout.targets, ...layout.walls].every(
    object => object.x < level.width && object.y < level.height
  );
}
