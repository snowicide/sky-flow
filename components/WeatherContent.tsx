"use client";
import { ChartSection } from "./ChartSection/ChartSection";
import { DailyForecast } from "./DailyForecast";
import { HourlyForecast } from "./HourlyForecast";
import { StatusSection } from "./StatusSection";
import { TodayWeather } from "./TodayWeather";
import { WeatherDetails } from "./WeatherDetails";
import { WeatherContentSkeleton } from "./WeatherSkeleton";

import { useWeatherQuery } from "@/hooks/useWeatherQuery";

export function WeatherContent({
  params,
}: {
  params: { city?: string; lat?: string; lon?: string; country?: string };
}) {
  const lat = Number(params.lat) || 53.9;
  const lon = Number(params.lon) || 27.56667;
  const city = params.city || "Minsk";
  const country = params.country || "Belarus";

  const cityData = { lat, lon, city, country };

  const { data, isPending, isError, error } = useWeatherQuery(cityData);

  if (isPending) return <WeatherContentSkeleton />;
  if (isError || !data) return <StatusSection error={error} />;

  const { current, daily, hourly, forecastUnits } = data;
  return (
    <div className="flex flex-col w-auto justify-center items-center">
      <div className="flex flex-col items-center lg:items-start lg:flex-row gap-8 mb-10">
        <div className="flex-1 w-full xl:max-w-200">
          <TodayWeather currentData={current} forecastUnits={forecastUnits} />
          <WeatherDetails currentData={current} forecastUnits={forecastUnits} />
          <DailyForecast dailyData={daily} />
        </div>
        <HourlyForecast hourlyData={hourly} forecastUnits={forecastUnits} />
      </div>

      <ChartSection dailyData={daily} hourlyData={hourly} />
    </div>
  );
}
