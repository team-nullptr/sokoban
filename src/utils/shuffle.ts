/** Shuffles given array using Fisher-Yates method */
export default function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Get random index
    [array[i], array[j]] = [array[j], array[i]]; // Swap pairs
  }

  return array;
}
