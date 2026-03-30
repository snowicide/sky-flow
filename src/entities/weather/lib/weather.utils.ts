import {
  formatDayOfWeek,
  formatHourOfDay,
  getHourNumber,
} from "@shared/lib/formatters";

import type { DailyForecast, format, HourlyItem } from "../model/types";
import type { WeatherHourly } from "../model/weather.types";

import { getWeatherIcon } from "./icons";

export function calculateAverageTemps(min: number, max: number): number {
  return Math.round((min + max) / 2);
}

export function groupByDay(
  data?: WeatherHourly,
  format?: format,
): DailyForecast[] {
  if (!format) format = { hourFormat: "12", dayFormat: "dddd" };
  const { hourFormat, dayFormat } = format;

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
        dayName: formatDayOfWeek(date, dayFormat),
        hours: [],
      });
    }

    const icon = getWeatherIcon(data.weatherCode[index]);

    const hourItem: HourlyItem = {
      hour: formatHourOfDay(date, hourFormat),
      temp: data.temperature[index],
      weatherCode: data.weatherCode[index],
      image: icon,
    };

    days[currentDayIndex].hours.push(hourItem);
  });

  days.forEach((day) => {
    day.hours.sort((a, b) => {
      if (hourFormat === "12") {
        let hourA = getHourNumber(a.hour);
        let hourB = getHourNumber(b.hour);
        if (!hourA) hourA = 0;
        if (!hourB) hourB = 0;
        return hourA - hourB;
      } else {
        return parseInt(a.hour) - parseInt(b.hour);
      }
    });
  });

  return days;
}
