/** Represents level layout */
export default interface LevelLayout {
  start: Position;
  boxes: Position[];
  targets: Position[];
  walls: Position[];
}
