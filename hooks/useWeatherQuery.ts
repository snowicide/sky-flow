import { fetchWeatherData } from "@/services/fetchWeatherData";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useWeatherQuery(city: string) {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: async ({ signal }) => {
      const timeoutSignal = AbortSignal.timeout(3000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);
      return fetchWeatherData(city, combinedSignal);
    },
    enabled: !!city && city.trim().length > 0,

    retry: (failureCount, error) => {
      if (
        error?.message?.includes("404") ||
        error?.message === "GEOCODING_FAILED" ||
        error?.name === "AbortError"
      )
        return false;

      return failureCount < 3;
    },

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,

    staleTime: 0,
  });
}
