import LevelLayout from '../models/LevelLayout';
import Level from '../models/Level';
import isLayoutCompatible from './isLayoutCompatible';

const level: Level = {
  start: { x: 3, y: 2 },
  boxes: [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ],
  targets: [{ x: 1, y: 3 }],
  walls: [],
  height: 5,
  width: 5,
};

const layout: LevelLayout = {
  start: { x: 2, y: 2 },
  boxes: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
  ],
  targets: [{ x: 0, y: 3 }],
  walls: [],
};

test('compatible layouts', () => {
  expect(isLayoutCompatible(layout, level)).toBe(true);
});

test('player position incompatible', () => {
  const copy = { ...layout, start: { x: 5, y: 2 } };
  expect(isLayoutCompatible(copy, level)).toBe(false);
});

test("one block's position incompatible", () => {
  const copy = { ...layout, targets: [{ x: 3, y: 5 }] };
  expect(isLayoutCompatible(copy, level)).toBe(false);
});

test('missing block', () => {
  const copy = { ...layout, boxes: [{ x: 1, y: 0 }] };
  expect(isLayoutCompatible(copy, level)).toBe(false);
});
