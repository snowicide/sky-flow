import { calculateAverageTemps } from "./calculateAverageTemps";

describe("calculateAverageTemps", () => {
  let min: number;
  let max: number;
  let tempMax: number[];

  beforeEach(() => {
    min = 2;
    max = 5;
    tempMax = [5];
  });

  it("should calculate average temps", () => {
    expect(calculateAverageTemps(min, max, tempMax)).toEqual([4]);
  });
});
