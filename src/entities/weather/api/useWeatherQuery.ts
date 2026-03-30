import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { type CityData, isFoundCity } from "@/entities/location";
import { useSettingsStore } from "@/entities/settings";
import { AppError } from "@/shared";

import type { Weather } from "../model/weather.types";

import { fetchForecastData } from "./weather.api";

export function useWeatherQuery(
  cityData: CityData,
): UseQueryResult<Weather, AppError> {
  const units = useSettingsStore((state) => state.units);
  const isEnabled = isFoundCity(cityData);

  return useQuery<Weather, AppError>({
    queryKey: [
      "weather",
      isEnabled ? cityData.lat : "no-coords",
      isEnabled ? cityData.lon : "no-coords",
      units.temperatureUnit,
      units.speedUnit,
      units.precipitationUnit,
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
