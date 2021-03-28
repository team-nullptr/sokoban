import { SolvedLevel } from '../../models/SolvedLevel';

export const LevelsModuleTwo: SolvedLevel[] = [
  {
    width: 3,
    height: 7,
    walls: [
      { x: 0, y: 3 },
      { x: 2, y: 3 },
    ],
    boxes: [{ x: 1, y: 3 }],
    targets: [{ x: 1, y: 5 }],
    start: { x: 1, y: 1 },
    solution: { time: 300, moves: { box: 2, player: 3 } },
  },
  {
    width: 5,
    height: 5,
    walls: [
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ],
    boxes: [{ x: 2, y: 2 }],
    targets: [{ x: 0, y: 4 }],
    start: { x: 3, y: 2 },
    solution: { time: 2500, moves: { box: 6, player: 14 } },
  },
  {
    width: 5,
    height: 5,
    walls: [
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
    ],
    boxes: [
      { x: 2, y: 0 },
      { x: 3, y: 4 },
    ],
    targets: [
      { x: 0, y: 4 },
      { x: 4, y: 0 },
    ],
    start: { x: 3, y: 0 },
    solution: { time: 2750, moves: { box: 7, player: 18 } },
  },
  {
    width: 5,
    height: 5,
    walls: [
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 4, y: 1 },
      { x: 3, y: 3 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 3, y: 1 },
    ],
    boxes: [
      { x: 3, y: 2 },
      { x: 1, y: 2 },
    ],
    targets: [
      { x: 0, y: 4 },
      { x: 2, y: 2 },
    ],
    start: { x: 2, y: 1 },
    solution: { time: 2000, moves: { box: 4, player: 12 } },
  },
  {
    width: 6,
    height: 6,
    walls: [
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    boxes: [
      { x: 3, y: 4 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
    ],
    targets: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
    start: { x: 4, y: 4 },
    solution: { time: 6800, moves: { box: 16, player: 33 } },
  },
  {
    width: 5,
    height: 7,
    walls: [
      { x: 1, y: 3 },
      { x: 1, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 3 },
      { x: 0, y: 6 },
      { x: 2, y: 0 },
    ],
    boxes: [
      { x: 3, y: 4 },
      { x: 1, y: 4 },
    ],
    targets: [
      { x: 4, y: 5 },
      { x: 0, y: 3 },
    ],
    start: { x: 2, y: 4 },
    solution: { time: 8800, moves: { box: 10, player: 44 } },
  },
];
