import { fetchSearchResults } from "@/services/fetchSearchResults";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { AppError } from "@/types/errors";
import { useQuery } from "@tanstack/react-query";

export function useSearchQuery(searchResult: string) {
  const units = useSettingsStore((state) => state.units);

  return useQuery({
    queryKey: ["search", searchResult, units],
    queryFn: async () => {
      fetchSearchResults(searchResult, units);
    },

    enabled: !!searchResult && searchResult.trim().length > 0,

    retry: (failureCount, error) => {
      if (error instanceof AppError) {
        if (error.code === "GEOCODING_FAILED") return false;
      }
      return failureCount < 2;
    },

    refetchOnWindowFocus: false,

    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
