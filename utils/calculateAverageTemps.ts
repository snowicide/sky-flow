export const calculateAverageTemps = (
  min: number,
  max: number,
  tempMax: number[],
) => {
  const averages = [];
  for (let i = 0; i < tempMax.length; i++) {
    const avg = Math.round((min + max) / 2);
    averages.push(avg);
  }
  return averages;
};
