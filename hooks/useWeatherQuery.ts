import { fetchWeatherData } from "@/services/fetchWeatherData";
import { useQuery } from "@tanstack/react-query";

export function useWeatherQuery(city: string) {
  return useQuery({
    queryKey: ["weather", city],

    queryFn: () => fetchWeatherData(city),

    enabled: !!city && city.trim().length > 0,

    retry: (failureCount, error) => {
      if (error?.message === "GEOCODING_FAILED") return false;
      return failureCount < 2;
    },
  });
}
