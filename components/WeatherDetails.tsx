"use client";
import WeatherDetailsSkeleton from "./skeletons/WeatherDetails.skeleton";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import { useSearchParams } from "next/navigation";

export default function WeatherDetails() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "Minsk";
  const { data: result, isPending, isError } = useWeatherQuery(city);

  if (isPending || isError || !result?.success) {
    return <WeatherDetailsSkeleton />;
  }

  const currentData = result.data.current;

  const weatherDetails = [
    {
      title: "Feels Like",
      value: `${currentData.apparent_temperature.toFixed(1)}°`,
    },
    {
      title: "Humidity",
      value: `${currentData.relative_humidity_2m}%`,
    },
    {
      title: "Wind",
      value: `${currentData.wind_speed_10m} km/h`,
    },
    {
      title: "Precipitation",
      value: `${currentData.precipitation} mm`,
    },
  ];

  return (
    <div className="mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {weatherDetails.map(({ title, value }) => (
          <div
            key={title}
            className="bg-[hsl(243,27%,20%)] hover:opacity-75 transition duration-75 p-4 sm:p-5 rounded-xl border border-white/10"
          >
            <p className="text-white/70 text-sm sm:text mb-2">{title}</p>
            <p className="text-2xl sm:text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
