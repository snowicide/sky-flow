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

export default function HourlyForecast() {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const { weatherData } = useWeatherStore();
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
      console.log(
        `Время: ${dateKey} ${date.getHours()}:00, Код: ${data.weather_code[index]}, Иконка: ${code}`,
      );
      const hourItem: HourlyItem = {
        hour: formatHourOfDay(date),
        temp: data.temperature_2m[index],
        weatherCode: data.weather_code[index],
        image: getIconByWeatherCode[code],
      };
      days[currentDayIndex].hours.push(hourItem);
    });

    return days;
  };

  const filterHours = (hours: HourlyItem[]): HourlyItem[] => {
    return hours.filter((hourItem) => {
      const hour24 = getHourNumber(hourItem.hour);
      if (!hour24) return false;
      const isPM = hourItem.hour.includes("PM");
      return isPM && hour24 >= 15 && hour24 <= 22;
    });
  };

  const days = groupByDay().slice(1);
  const selectedDay = days[selectedDayIndex] || {
    date: "",
    dayName: "",
    hours: [],
  };
  const filteredHours = filterHours(selectedDay.hours);

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

        <div className="space-y-3">
          {filteredHours.map(({ hour, image, temp }, index) => (
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
