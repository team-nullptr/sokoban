import Stopwatch from './Stopwatch';

const timer = new Stopwatch();

it('is not running automatically', () => {
  expect(timer.time).toBe(0);
  expect(timer.stopped).toBe(true);
});

it('starts', () => {
  timer.start();
  expect(timer.stopped).toBe(false);
});

it('stops', () => {
  timer.stop();
  expect(timer.stopped).toBe(true);
});

it('keeps being stopped when trying to stop stopped game', () => {
  timer.stop();
  expect(timer.stopped).toBe(true);
});

it('resumes', () => {
  timer.start();
  expect(timer.stopped).toBe(false);
});

it('keeps running when trying to resume started game', () => {
  timer.start();
  expect(timer.stopped).toBe(false);
});

it('stops after being reset', () => {
  timer.reset();
  expect(timer.stopped).toBe(true);
});
