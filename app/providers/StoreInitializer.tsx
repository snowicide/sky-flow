"use client";
import { useEffect } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import { searchWeather } from "../actions";

export default function StoreInitializer({
  initialData,
  city = "Minsk",
}: {
  initialData: object;
  city?: string;
}) {
  const setWeatherData = useWeatherStore((state) => state.setWeatherData);
  const weatherData = useWeatherStore((state) => state.weatherData);
  const lastCity = useWeatherStore((state) => state.lastCity);

  useEffect(() => {
    if (!weatherData && initialData) {
      setWeatherData(initialData, city);
    }

    if (!weatherData && lastCity && lastCity !== city) {
      const loadLastCity = async () => {
        const result = await searchWeather(lastCity);
        if (result.success) setWeatherData(result.data, lastCity);
      };
      loadLastCity();
    }
  }, [city, initialData, setWeatherData, weatherData, lastCity]);
  return null;
}
