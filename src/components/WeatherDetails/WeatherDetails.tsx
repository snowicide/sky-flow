"use client";
import { useMemo } from "react";

import type {
  WeatherDataCurrent,
  WeatherDataUnits,
} from "@/types/api/WeatherData";

export default function WeatherDetails({
  currentData,
  forecastUnits,
}: WeatherDetailsProps) {
  const weatherDetails = useMemo(
    () => [
      {
        title: "Feels Like",
        value: currentData.apparent_temperature.toFixed(1),
        unit: forecastUnits.temperature,
      },
      {
        title: "Humidity",
        value: currentData.relative_humidity_2m.toString(),
        unit: "%",
      },
      {
        title: "Wind",
        value: currentData.wind_speed_10m.toString(),
        unit: forecastUnits.speed,
      },
      {
        title: "Precipitation",
        value: currentData.precipitation.toString(),
        unit: forecastUnits.precipitation,
      },
    ],
    [currentData, forecastUnits],
  );

  return (
    <section aria-label="Weather Details" className="mb-10">
      <h2 className="sr-only">Weather Details</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {weatherDetails.map(({ title, value, unit }) => (
          <li
            key={title}
            className="bg-[hsl(243,27%,20%)] hover:opacity-75 transition duration-75 p-4 sm:p-5 rounded-xl border border-white/10"
          >
            <p className="text-white/70 text-sm mb-2">{title}</p>
            <p className="font-semibold">
              <span className="text-2xl">{value} </span>
              <span className="text-white/70 text-xl">{unit}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface WeatherDetailsProps {
  currentData: WeatherDataCurrent;
  forecastUnits: WeatherDataUnits;
}
