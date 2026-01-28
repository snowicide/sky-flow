import {
  formatDayOfWeek,
  formatHourOfDay,
  getHourNumber,
} from "@/utils/formatDay";
import type { DailyForecast, HourlyItem } from "@/types/WeatherHourly";
import { getIconByWeatherCode } from "@/utils/getIconByWeatherCode";
import { getWeatherCode } from "@/utils/weatherCodes";
import { WeatherDataHourly } from "@/types/WeatherData";

export default function groupByDay(data?: WeatherDataHourly): DailyForecast[] {
  const days: DailyForecast[] = [];
  if (!data?.time?.length) return days;
  let currentDay = "";
  let currentDayIndex = -1;

  data.time.forEach((timeStr, index) => {
    const date = new Date(timeStr);
    const dateKey = date.toISOString().split("T")[0];
    if (dateKey !== currentDay) {
      currentDay = dateKey;
      currentDayIndex++;

      days.push({
        date: dateKey,
        dayName: formatDayOfWeek(date),
        hours: [],
      });
    }

    const code = getWeatherCode(data.weather_code[index]);
    const hourItem: HourlyItem = {
      hour: formatHourOfDay(date),
      temp: data.temperature_2m[index],
      weatherCode: data.weather_code[index],
      image: getIconByWeatherCode[code],
    };

    days[currentDayIndex].hours.push(hourItem);
  });

  days.forEach((day) => {
    day.hours.sort((a, b) => {
      let hourA = getHourNumber(a.hour);
      let hourB = getHourNumber(b.hour);
      if (!hourA) hourA = 0;
      if (!hourB) hourB = 0;
      return hourA - hourB;
    });
  });

  return days;
}
