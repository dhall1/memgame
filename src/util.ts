
export function shuffleArray(arr: Array<number>): Array<number> {
  let arr1 = [...arr];
  for (let i = arr1.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr1[i], arr1[j]] = [arr1[j], arr1[i]];
  }
  return arr1;
}
