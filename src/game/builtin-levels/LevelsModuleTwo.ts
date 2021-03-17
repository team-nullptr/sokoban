import Level from '../../models/Level';

export const LevelsModuleTwo: Level[] = [
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
  },
];
