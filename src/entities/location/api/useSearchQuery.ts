import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { useSettingsStore } from "@/entities/settings";
import { type SearchResults, fetchSearchResults } from "@/entities/weather";
import { AppError } from "@/shared";

export function useSearchQuery(
  searchResult: string,
): UseQueryResult<SearchResults, AppError> {
  const units = useSettingsStore((state) => state.units);
  const queryValue = searchResult.trim().toLowerCase();

  return useQuery<SearchResults, AppError>({
    queryKey: [
      "search",
      queryValue,
      units.temperatureUnit,
      units.speedUnit,
      units.precipitationUnit,
    ],
    queryFn: async ({ signal }) => {
      const timeoutSignal = AbortSignal.timeout(5000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);
      return await fetchSearchResults(queryValue, units, combinedSignal);
    },

    enabled: !!queryValue && queryValue.trim().length >= 2,

    retry: (failureCount) => failureCount < 2,

    refetchOnWindowFocus: false,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
