export function average2D(array: number[][]): number[] {
  let result: number[] = new Array(array[0].length).fill(0);
  array.forEach((dataPoint) => {
    dataPoint.forEach((value, index) => {
      result[index] = result[index] + Math.abs(value);
    });
  });
  return result.map((sum) => sum / array.length);
}
