import Vector from '../models/Vector';

/** Adds two vectors */
export function addVectors(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}

/** Multiplies vector by value */
export function multiplyVector(vector: Vector, value: number): Vector {
  return { x: vector.x * value, y: vector.y * value };
}
