import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { fetchForecastData } from "@/services/fetchForecastData";
import { useSettingsStore } from "@/stores/useSettingsStore";
import type { WeatherData } from "@/types/api/WeatherData";
import { AppError } from "@/types/errors";
import { isFoundCity, type CityData } from "@/types/location";

export function useWeatherQuery(
  cityData: CityData,
): UseQueryResult<WeatherData, AppError> {
  const units = useSettingsStore((state) => state.units);
  const isEnabled = isFoundCity(cityData);

  return useQuery<WeatherData, AppError>({
    queryKey: [
      "weather",
      isEnabled ? cityData.lat : "no-coords",
      isEnabled ? cityData.lon : "no-coords",
      units.temperature,
      units.speed,
      units.precipitation,
    ],

    queryFn: async ({ signal }) => {
      if (!isFoundCity(cityData))
        throw new AppError(
          "FORECAST_FAILED",
          "Cannot fetch weather! City coords not found...",
        );

      const timeoutSignal = AbortSignal.timeout(5000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

      const data = await fetchForecastData(cityData, units, combinedSignal);
      return data;
    },

    enabled: isEnabled,

    retry: (failureCount) => failureCount < 3,

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    refetchOnWindowFocus: false,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
