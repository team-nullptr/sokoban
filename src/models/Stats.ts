/** Represents game statistics */
export default interface Stats {
  time: number;
  moves: {
    player: number;
    box: number;
  };
}
