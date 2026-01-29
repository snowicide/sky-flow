"use client";
import { useWeatherStore } from "@/store/useWeatherStore";
import { startTransition, useEffect, useState } from "react";

export default function DynamicTitle() {
  const [isClient, setIsClient] = useState<boolean>(false);
  const weatherData = useWeatherStore((state) => state.weatherData);
  const lastCity = useWeatherStore((state) => state.lastCity);

  useEffect(() => {
    startTransition(() => setIsClient(true));
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (weatherData?.current.city === lastCity) {
      const city = weatherData?.current?.city;
      document.title = `Weather - ${city}`;
    } else {
    }
  }, [isClient, weatherData, lastCity]);

  return null;
}
