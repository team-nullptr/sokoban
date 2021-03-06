import { Direction } from '../models/Direction';
import Vector from '../models/Vector';

/** Creates vector from given direction */
export default function vectorFromDirection(direction: Direction): Vector {
  switch (direction) {
    case Direction.Up:
      return { x: 0, y: -1 };
    case Direction.Down:
      return { x: 0, y: 1 };
    case Direction.Left:
      return { x: -1, y: 0 };
    case Direction.Right:
      return { x: 1, y: 0 };
  }
}
