import Vector from '../modules/game-runner/models/Vector';

/** Represents level layout */
export default interface LevelLayout {
  start: Vector;
  boxes: Vector[];
  targets: Vector[];
  walls: Vector[];
}
