import getGridSize from './getGridSize';

test('grid size on vertical available space, when required space is horizontal', () => {
  expect(getGridSize({ width: 100, height: 50 }, { width: 5, height: 10 })).toBe(5);
});

test('grid size on vertical available space, when required space is horizontal', () => {
  expect(getGridSize({ width: 50, height: 100 }, { width: 10, height: 5 })).toBe(5);
});

test('square area on square area', () => {
  expect(getGridSize({ width: 100, height: 100 }, { width: 5, height: 5 })).toBe(20);
});

test('value 0 in required space', () => {
  console.log(getGridSize({ width: 100, height: 100 }, { width: 5, height: 0 }));
  expect(getGridSize({ width: 100, height: 100 }, { width: 5, height: 0 })).toBe(0);
});
