"use client";
import dayjs from "dayjs";
import { useMemo } from "react";
import { formatCityDisplay } from "@/entities/location";
import { type WeatherCurrent, type WeatherUnits } from "@/entities/weather";
import { WeatherIcon } from "@/entities/weather";
import { SparklesIcon } from "@/shared/ui";
import { TodaySkeleton } from "./TodaySkeleton";

export function Today({ currentData, forecastUnits, isPending }: TodayProps) {
  const displayName = useMemo(() => {
    if (!currentData) return "";
    return formatCityDisplay({
      status: "found",
      city: currentData.city,
      country: currentData.country,
      region: currentData.region,
      code: currentData.code,
      lat: currentData.lat,
      lon: currentData.lon,
    });
  }, [currentData]);

  const handleAiTooltip = async () => {};

  return (
    <section
      aria-label="Current Weather"
      className="relative rounded-2xl overflow-hidden h-70 mb-8 grid-cols-1 content-center"
    >
      {/* background */}
      <div className="absolute inset-0 -z-10 w-full h-full">
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet="/images/bg-today-small.webp"
          />
          <source
            media="(min-width: 640px"
            srcSet="/images/bg-today-large.webp"
          />
          <img
            src="/images/bg-today-large.webp"
            alt="Today background"
            fetchPriority="high"
            className={`w-full h-70 object-fill sm:object-cover ${isPending || !currentData || !forecastUnits ? "opacity-70" : ""}`}
          />
        </picture>
      </div>

      {/* content */}
      {isPending || !currentData || !forecastUnits ? (
        <TodaySkeleton />
      ) : (
        <>
          <div className="relative flex flex-col sm:flex-row justify-between items-center gap-2 px-6 md:px-8 h-55">
            {/* city and date */}
            <div className="flex flex-1 flex-col gap-2 items-center sm:items-start">
              <h2 className="text-xl sm:text-3xl font-bold capitalize">
                {displayName}
              </h2>
              <p className="text-white/70 text-lg">
                {dayjs(currentData.time).format("dddd, MMM D, YYYY")}
              </p>
              <button
                onClick={handleAiTooltip}
                className="flex items-center gap-1.5 hover:cursor-pointer group transition-all
                  bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 focus:outline-none active:border-white/30 active:bg-white/15
                  rounded-2xl px-4 py-1.5"
              >
                <span className="text-white font-medium group-hover:text-white transition-all duration-200">
                  More details
                </span>

                <SparklesIcon
                  className="transition-transform duration-200
                    group-hover:[--s1:#818cf8] group-hover:[--s2:#fc28f2] group-hover:scale-105"
                  size={20}
                  stop1="#6366f1"
                  stop2="#ec4899"
                />
              </button>
            </div>

            {/* icon and temp */}
            <div className="flex flex-1 items-center justify-center sm:justify-end gap-4 w-full sm:w-auto">
              <WeatherIcon
                code={currentData.weatherCode}
                className="w-25 md:w-35 object-contain"
              />
              <div className="flex items-start font-bold">
                <span className="text-7xl md:text-8xl leading-none">
                  {Math.round(currentData.temperature)}
                </span>
                <span className="text-2xl sm:text-3xl text-white/70 ml-1">
                  {forecastUnits.temperatureUnit}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

interface TodayProps {
  currentData?: WeatherCurrent;
  forecastUnits?: WeatherUnits;
  isPending: boolean;
}
