import { fetchWeatherData } from "@/services/fetchWeatherData";
import { AppError } from "@/types/errors";
import { useQuery } from "@tanstack/react-query";
import { useSearchHistory } from "./useSearchHistory";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function useWeatherQuery(city: string) {
  const { addCity } = useSearchHistory();
  const units = useSettingsStore((state) => state.units);
  const queryValue = city.trim().toLowerCase();

  return useQuery({
    queryKey: [
      "weather",
      queryValue,
      units.temperature,
      units.speed,
      units.precipitation,
    ],
    queryFn: async ({ signal }) => {
      const timeoutSignal = AbortSignal.timeout(5000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);
      const data = await fetchWeatherData(queryValue, units, combinedSignal);
      if (data) {
        const { city, country } = data.current;
        addCity(city.toLowerCase(), country.toLowerCase());
      }
      return data;
    },

    enabled: !!queryValue && queryValue.trim().length > 0,

    retry: (failureCount, error) => {
      if (error instanceof AppError) {
        if (error.code === "GEOCODING_FAILED") return false;
      }
      return failureCount < 3;
    },

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    refetchOnWindowFocus: false,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
