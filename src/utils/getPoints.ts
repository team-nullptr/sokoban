import Level from '../models/Level';
import Stats from '../models/Stats';
import clamp from './clamp';

/**
 * Returns number of points calculated using following formula
 * p / 5 + b / nb / 1.6 + t / 2
 * Where
 * p is player moves
 * b is box moves
 * nb is box count
 * t is time in seconds
 */
function calculatePoints(solution: Stats, level: Level): number {
  const {
    time,
    moves: { box, player },
  } = solution;

  const points = player / 5 + box / level.boxes.length / 1.6 + time / 2000;
  return Math.max(1, Math.floor(points));
}

export default function getPoints(stats: Stats, solution: Stats, level: Level): number {
  // Get points from current game and solution
  const best = calculatePoints(solution, level);
  const current = calculatePoints(stats, level);

  // Calculate a loss with minimal value of 0
  const loss = Math.max(0, current - best);

  // Calculate points
  const points = clamp(best - loss, 1, best);

  return points;
}
