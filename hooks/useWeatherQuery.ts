import { fetchWeatherData } from "@/services/fetchWeatherData";
import { useQuery } from "@tanstack/react-query";

export function useWeatherQuery(city: string) {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: ({ signal }) => fetchWeatherData(city, signal),
    enabled: !!city && city.trim().length > 0,

    retry: (failureCount, error) => {
      if (
        error?.message?.includes("404") ||
        error?.message?.includes("GEOCODING_FAILED") ||
        error?.name === "AbortError"
      )
        return false;

      return failureCount < 3;
    },

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    meta: { timeout: 5000 },
    refetchOnWindowFocus: true,
  });
}
