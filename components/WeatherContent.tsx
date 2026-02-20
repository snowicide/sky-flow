"use client";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import { DailyForecast } from "./DailyForecast";
import { TodayWeather } from "./TodayWeather";
import { WeatherDetails } from "./WeatherDetails";
import { HourlyForecast } from "./HourlyForecast";
import { StatusSection } from "./StatusSection";
import { WeatherContentSkeleton } from "./WeatherSkeleton";

export function WeatherContent({
  params,
}: {
  params: { city?: string; lat?: string; lon?: string; country?: string };
}) {
  const lat = params.lat;
  const lon = params.lon;
  const city = params.city;
  const country = params.country;

  const { data, isPending, isError, error } = useWeatherQuery(
    Number(lat) || 53.9,
    Number(lon) || 27.56667,
    city || "Minsk",
    country || "Belarus",
  );

  if (isPending) return <WeatherContentSkeleton />;
  if (isError || !data) return <StatusSection error={error} />;

  const { current, daily, hourly, forecastUnits } = data;

  return (
    <>
      <div className="flex flex-col items-center lg:items-start justify-center lg:flex-row gap-8">
        <div className="flex-1 w-full xl:max-w-200">
          <TodayWeather currentData={current} forecastUnits={forecastUnits} />
          <WeatherDetails currentData={current} forecastUnits={forecastUnits} />
          <DailyForecast dailyData={daily} />
        </div>
        <HourlyForecast hourlyData={hourly} forecastUnits={forecastUnits} />
      </div>
    </>
  );
}
