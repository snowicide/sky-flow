import { calculateAverageTemps } from "./calculateAverageTemps";
import { formatDayOfWeek } from "./formatDay";

import type { WeatherDataDaily } from "@/types/api/WeatherData";

export function getChartDailyData(
  dailyData: WeatherDataDaily,
): { day: string; temp: number }[] {
  return dailyData.time.map((time, index) => {
    const min = dailyData.temperature_2m_min[index];
    const max = dailyData.temperature_2m_max[index];
    const date = new Date(time);
    return {
      day: formatDayOfWeek(date),
      temp: calculateAverageTemps(min, max),
    };
  });
}
