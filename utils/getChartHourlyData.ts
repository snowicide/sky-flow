import groupByDay from "./groupByDay";

import type { WeatherDataHourly } from "@/types/api/WeatherData";

export function getChartHourlyData(
  hourlyData: WeatherDataHourly,
): { hour: string; temp: number }[] {
  const filteredDays = groupByDay(hourlyData);

  return filteredDays[1].hours.map((item) => ({
    hour: item.hour,
    temp: item.temp,
  }));
}
