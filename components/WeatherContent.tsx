"use client";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import { DailyForecast } from "./DailyForecast";
import { TodayWeather } from "./TodayWeather";
import { WeatherDetails } from "./WeatherDetails";
import { HourlyForecast } from "./HourlyForecast";
import WeatherContentSkeleton from "./WeatherSkeleton/WeatherContent.skeleton";
import ErrorSection from "./ErrorSection";

export default function WeatherContent({
  params,
}: {
  params: { city?: string };
}) {
  const { data, isPending, isError, error } = useWeatherQuery(
    params.city || "",
  );

  if (isPending) return <WeatherContentSkeleton />;

  if (isError || !data.success)
    return <ErrorSection isError={isError} data={data} error={error} />;

  const { current, daily, hourly } = data.data;

  return (
    <>
      <div className="flex flex-col items-center lg:items-start justify-center lg:flex-row gap-8">
        <div className="flex-1 w-full xl:max-w-200">
          <TodayWeather currentData={current} />
          <WeatherDetails currentData={current} />
          <DailyForecast dailyData={daily} />
        </div>
        <HourlyForecast />
      </div>
    </>
  );
}
