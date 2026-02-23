"use client";

import type { WeatherDetailsProps } from "./WeatherDetails.types";

export default function WeatherDetails({
  currentData,
  forecastUnits,
}: WeatherDetailsProps) {
  const {
    apparent_temperature: temp,
    relative_humidity_2m: humidity,
    wind_speed_10m: speed,
    precipitation,
  } = currentData;
  const {
    temperature: tempUnit,
    speed: speedUnit,
    precipitation: precipitationUnit,
  } = forecastUnits;

  const weatherDetails = [
    {
      title: "Feels Like",
      value: `${temp.toFixed(1)}`,
      unit: tempUnit,
    },
    {
      title: "Humidity",
      value: `${humidity}`,
      unit: "%",
    },
    {
      title: "Wind",
      value: `${speed}`,
      unit: speedUnit,
    },
    {
      title: "Precipitation",
      value: `${precipitation}`,
      unit: precipitationUnit,
    },
  ];

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
