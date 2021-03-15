import LevelLayout from './LevelLayout.js';

/** Represents playable level */
export default interface Level extends LevelLayout {
  height: number;
  width: number;
}
