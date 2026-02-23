function generateTicks(min: number, max: number): number[] {
  const ticks = [];
  for (let i = Math.floor(min); i <= Math.ceil(max); i += 2) {
    ticks.push(i);
  }
  return ticks;
}

export function getTicks(chartData: { temp: number }[]): number[] {
  return generateTicks(
    Math.min(...chartData.map((item) => item.temp)) - 3,
    Math.max(...chartData.map((item) => item.temp)) + 3,
  );
}
