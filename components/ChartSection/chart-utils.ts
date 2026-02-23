import type { WeatherDataDaily } from "@/types/api/WeatherData";
import type { WeatherDataHourly } from "@/types/api/WeatherData";
import { formatDayOfWeek } from "@/utils/formatters";
import { calculateAverageTemps, groupByDay } from "@/utils/weather";

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

export function getChartHourlyData(
  hourlyData: WeatherDataHourly,
): { hour: string; temp: number }[] {
  const filteredDays = groupByDay(hourlyData);

  return filteredDays[1].hours.map((item) => ({
    hour: item.hour,
    temp: item.temp,
  }));
}
