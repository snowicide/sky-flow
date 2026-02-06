"use client";
import Image from "next/image";
import bgTodayMobile from "@/public/images/bg-today-small.webp";
import bgTodayDesktop from "@/public/images/bg-today-large.webp";
import dayjs from "dayjs";
import { getWeatherCode } from "@/utils/weatherCodes";
import { getIconByWeatherCode } from "@/utils/getIconByWeatherCode";
import { WeatherDataCurrent } from "@/types/WeatherData";

export interface TodayWeatherProps {
  currentData: WeatherDataCurrent;
}

export default function TodayWeather({ currentData }: TodayWeatherProps) {
  const code = getWeatherCode(currentData.weather_code);
  const icon = getIconByWeatherCode[code];

  return (
    <div className="relative rounded-2xl py-8 overflow-hidden mb-8">
      <div className="absolute inset-0 -z-100 w-full h-full">
        <Image
          src={bgTodayMobile}
          alt="Today background"
          priority
          fill
          className=" object-cover w-full h-full md:hidden"
        />
        <Image
          src={bgTodayDesktop}
          alt="Today background"
          priority
          fill
          className="w-full h-full object-cover hidden md:block"
        />
      </div>

      <div className="relative p-6 sm:p-8 md:p-10">
        <div className="flex items-center flex-col sm:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold mb-2">
              <span>{currentData.city}, </span>
              <span>{currentData.country}</span>
            </h2>
            <p className="text-white/70 text-lg">
              {dayjs().format("dddd, MMM D, YYYY")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 sm:w-35 sm:h-35">
              <Image src={icon} alt="Sunny" className="object-contain" />
            </div>
            <div className="font-bold flex gap-3">
              <span className="text-5xl sm:text-6xl md:text-8xl italic">
                {currentData.temperature_2m.toFixed(1)}
              </span>
              <span className="text-4xl sm:text-6xl">°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
