"use client";
import {
  formatDayOfWeek,
  formatHourOfDay,
  getHourNumber,
} from "@/utils/formatDay";
import type { DailyForecast, HourlyItem } from "@/types/WeatherHourly";
import Image from "next/image";
import dropdownIcon from "@/public/icons/icon-dropdown.svg";
import { getIconByWeatherCode } from "@/utils/getIconByWeatherCode";
import { useState } from "react";
import { getWeatherCode } from "@/utils/weatherCodes";
import { useWeatherStore } from "@/store/useWeatherStore";
import HourlyForecastSkeleton from "./skeletons/HourlyForecast.skeleton";

export default function HourlyForecast() {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const { weatherData, isLoading } = useWeatherStore();

  if (!weatherData?.hourly || isLoading) {
    return <HourlyForecastSkeleton />;
  }

  const data = weatherData.hourly;

  const groupByDay = (): DailyForecast[] => {
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
      console.log(hourItem);

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
  };

  const days = groupByDay().slice(1);
  const selectedDay = days[selectedDayIndex] || {
    date: "",
    dayName: "",
    hours: [],
  };
  const hours = selectedDay.hours;

  return (
    <div className="lg:w-96 w-full md:max-w-full">
      <div className="bg-[hsl(243,27%,20%)] p-5 sm:p-6 rounded-2xl border border-white/10 sticky top-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Hourly forecast</h3>
          <button className="flex items-center gap-2 bg-[hsl(243,23%,30%)] px-4 py-2 rounded-lg border border-white/10 hover:opacity-70 transition-opacity">
            <span>{selectedDay.dayName}</span>
            <Image src={dropdownIcon} alt="Dropdown" className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 overflow-auto max-h-136 scrollbar-hide">
          {hours.map(({ hour, image, temp }, index) => (
            <div
              key={`${hour}-${index}`}
              className="flex items-center justify-between bg-[hsl(243,23%,24%)] hover:opacity-75 transition duration-75 p-3 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <Image
                    src={image}
                    alt={`${hour} weather`}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium">{hour}</span>
              </div>
              <span className="text-xl font-bold">{temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
