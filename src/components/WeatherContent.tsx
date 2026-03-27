"use client";

import { SearchError } from "@/components/ui/SearchError";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import { AppError } from "@/types/errors";
import { isNotFoundCity, type CityData } from "@/types/location";

import { ChartSection } from "./ChartSection";
import { DailyForecast } from "./DailyForecast";
import { HourlyForecast } from "./HourlyForecast";
import { TodayWeather } from "./TodayWeather";
import { NetworkError } from "./ui/NetworkError";
import WeatherContentSkeleton from "./WeatherContentSkeleton";
import { WeatherDetails } from "./WeatherDetails";

export function WeatherContent({ cityData }: { cityData: CityData }) {
  const { data, isPending, isError, error, refetch } =
    useWeatherQuery(cityData);

  if (isNotFoundCity(cityData)) return <SearchError message={cityData.city} />;

  if (isPending) return <WeatherContentSkeleton />;
  if (isError || !data) {
    const message =
      error instanceof AppError && error.code === "FORECAST_FAILED"
        ? error.message
        : "Check your network connection...";
    return <NetworkError message={message} refetch={refetch} />;
  }

  const { current, daily, hourly, forecastUnits } = data;

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex flex-col w-full xl:w-auto max-w-99 sm:max-w-full lg:gap-4 xl:gap-8 mb-8 lg:mb-0 items-center lg:items-start lg:flex-row">
        <div className="w-full lg:min-w-150 xl:max-w-200 mb-8">
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
