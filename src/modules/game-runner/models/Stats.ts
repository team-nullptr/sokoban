/** Represents game statistics */
export default interface Stats {
  readonly time: number;
  readonly moves: {
    readonly player: number;
    readonly box: number;
  };
}
