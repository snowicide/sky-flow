"use client";
import Image from "next/image";
import { getWeatherCode } from "@/utils/weatherCodes";
import { formatDayOfWeek } from "@/utils/formatDay";
import { getIconByWeatherCode } from "@/utils/getIconByWeatherCode";
import { useWeatherStore } from "@/store/useWeatherStore";
import DailyForecastSkeleton from "./skeletons/DailyForecast.skeleton";

export default function DailyForecast() {
  const { weatherData, isLoading } = useWeatherStore();

  if (!weatherData?.daily || isLoading) {
    return <DailyForecastSkeleton />;
  }

  const data = weatherData.daily;

  const calculateAverageTemps = (min: number, max: number) => {
    const averages = [];
    for (let i = 0; i < data.temperature_2m_max.length; i++) {
      const avg = Math.round((min + max) / 2);
      averages.push(avg);
    }
    return averages;
  };

  const DailyForecast = data.time.map((dateStr: string, index: number) => {
    const date = new Date(dateStr);
    const code = getWeatherCode(data.weather_code[index]);
    const image = getIconByWeatherCode[code];

    return {
      day: formatDayOfWeek(date),
      weatherCode: data.weather_code?.[index] || 0,
      temp: `${calculateAverageTemps(data.temperature_2m_min[index], data.temperature_2m_max[index])[index]}°`,
      feelsLike: `${calculateAverageTemps(data.apparent_temperature_min[index], data.apparent_temperature_max[index])[index]}°`,
      date: dateStr,
      image,
    };
  });

  return (
    <div className="mb-10">
      <h3 className="text-xl sm:text-2xl font-bold mb-5">Daily forecast</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {DailyForecast.map(({ day, image, temp, feelsLike }) => (
          <div
            key={day}
            className="bg-[hsl(243,27%,20%)] p-4 rounded-xl border border-white/10 flex flex-col items-center"
          >
            <p className="font-medium mb-3 lg:text-sm">{day}</p>
            <div className="relative w-12 h-12 mb-3">
              <Image
                src={image}
                alt={`${day} weather`}
                className="object-contain"
              />
            </div>
            <div className="flex items-center self-center justify-center gap-4 w-full">
              <span className="font-bold">{temp}</span>
              <span className="text-white/70">{feelsLike}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
