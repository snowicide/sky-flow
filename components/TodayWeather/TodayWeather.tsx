"use client";
import Image from "next/image";
import bgTodayMobile from "@/public/images/bg-today-small.svg";
import bgTodayDesktop from "@/public/images/bg-today-large.svg";
import dayjs from "dayjs";

import { getWeatherCode } from "@/utils/weatherCodes";
import { getIconByWeatherCode } from "@/utils/getIconByWeatherCode";
import TodayWeatherSkeleton from "./TodayWeather.skeleton";
import { useSearchParams } from "next/navigation";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";

export default function TodayWeather() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "Minsk";
  const { data: result, isPending, isError, error } = useWeatherQuery(city);

  if (isPending && !isError) {
    return <TodayWeatherSkeleton />;
  }

  if ((isError && isPending) || !result?.success || !result.data?.current) {
    return (
      <div className="relative rounded-2xl py-8 overflow-hidden mb-8 bg-red-900/30">
        <div className="relative p-6 sm:p-8 md:p-10">
          <p className="text-red-300">Error: {error?.message}</p>
        </div>
      </div>
    );
  }

  const currentData = result.data.current;
  const code = getWeatherCode(currentData.weather_code);
  const icon = getIconByWeatherCode[code];

  return (
    <>
      {result && (
        <div className="relative rounded-2xl py-8 overflow-hidden mb-8">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={bgTodayMobile}
              alt="Today background"
              loading="eager"
              className=" object-contain w-full h-full scale-1000 md:hidden"
            />
            <Image
              src={bgTodayDesktop}
              alt="Today background"
              loading="eager"
              width={800}
              height={284}
              className="w-full h-full object-contain scale-1000 xl:scale-100 hidden md:block"
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
      )}
    </>
  );
}
