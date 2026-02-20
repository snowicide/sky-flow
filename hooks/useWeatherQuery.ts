import { AppError } from "@/types/errors";
import { useQuery } from "@tanstack/react-query";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { fetchForecastData } from "@/services/fetchForecastData";

export function useWeatherQuery(
  lat: number,
  lon: number,
  city: string,
  country: string,
) {
  const units = useSettingsStore((state) => state.units);

  return useQuery({
    queryKey: [
      "weather",
      lat,
      lon,
      units.temperature,
      units.speed,
      units.precipitation,
    ],
    queryFn: async ({ signal }) => {
      const timeoutSignal = AbortSignal.timeout(5000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);
      const data = await fetchForecastData(
        Number(lat),
        Number(lon),
        city,
        country,
        units,
        combinedSignal,
      );

      return data;
    },

    enabled: !!(lat && lon),

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
