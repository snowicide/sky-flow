"use client";
import { useWeatherStore } from "@/store/useWeatherStore";
import { useEffect } from "react";

export default function DynamicTitle() {
  const weatherData = useWeatherStore((state) => state.weatherData);
  const lastCity = useWeatherStore((state) => state.lastCity);

  useEffect(() => {
    const city = weatherData?.current.city || lastCity;
    if (city) {
      document.title = `Weather - ${city}`;
    }
  }, [lastCity, weatherData]);

  return null;
}
