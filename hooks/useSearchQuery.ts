import { fetchSearchResults } from "@/services/fetchSearchResults";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { AppError } from "@/types/errors";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useSearchQuery(searchResult: string) {
  const units = useSettingsStore((state) => state.units);
  const queryValue = searchResult.trim().toLowerCase();

  return useQuery({
    queryKey: [
      "search",
      queryValue,
      units.temperature,
      units.speed,
      units.precipitation,
    ],
    queryFn: () => fetchSearchResults(queryValue, units),

    enabled: !!queryValue && queryValue.trim().length > 0,

    retry: (failureCount, error) => {
      if (error instanceof AppError) {
        if (error.code === "GEOCODING_FAILED") return false;
      }
      return failureCount < 2;
    },

    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
