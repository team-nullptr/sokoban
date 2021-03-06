import Vector from './Vector';

/** Represents level layout */
export default interface LevelLayout {
  start: Vector;
  boxes: Vector[];
  targets: Vector[];
  walls: Vector[];
}
