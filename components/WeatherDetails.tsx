"use client";
import { useWeatherStore } from "@/store/useWeatherStore";

export default function WeatherDetails() {
  const { weatherData, isLoading } = useWeatherStore();

  if (!weatherData?.current || isLoading) {
    return (
      <div className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[hsl(243,27%,20%)] p-4 sm:p-5 rounded-xl border border-white/10 animate-pulse"
            >
              <div className="h-4 bg-gray-700 rounded mb-2 w-1/2"></div>
              <div className="h-8 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const data = weatherData.current;

  const weatherDetails = [
    {
      title: "Feels Like",
      value: `${data.apparent_temperature}°`,
    },
    {
      title: "Humidity",
      value: `${data.relative_humidity_2m}%`,
    },
    {
      title: "Wind",
      value: `${data.wind_speed_10m} km/h`,
    },
    {
      title: "Precipitation",
      value: `${data.precipitation} mm`,
    },
  ];

  return (
    <div className="mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {weatherDetails.map(({ title, value }) => (
          <div
            key={title}
            className="bg-[hsl(243,27%,20%)] p-4 sm:p-5 rounded-xl border border-white/10"
          >
            <p className="text-white/70 text-sm sm:text mb-2">{title}</p>
            <p className="text-2xl sm:text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
