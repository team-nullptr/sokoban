import { Direction } from '../models/Direction';
import Vector from '../models/Vector';

/** Adds two vectors */
export function addVectors(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}

/** Multiplies vector by value */
export function multiplyVector(vector: Vector, value: number): Vector {
  return { x: vector.x * value, y: vector.y * value };
}

/** Creates vector from given direction */
export function vectorFromDirection(direction: Direction): Vector {
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
