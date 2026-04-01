import { useDebounce } from "use-debounce";

import { useSearchQuery, useSearchStore } from "@/entities/location";
import type { SearchResults } from "@/entities/weather";

export function useSearchCity(): SearchReturn {
  const inputValue = useSearchStore((s) => s.inputValue);
  const [delayValue, { isPending }] = useDebounce(inputValue, 500);
  const isDebouncing = isPending();

  const { data: resultData, isFetching: isDelayFetching } =
    useSearchQuery(delayValue);

  const shouldSearchSkeleton =
    (isDebouncing || isDelayFetching) && !!inputValue.trim();

  return {
    shouldSearchSkeleton,
    resultData,
  };
}

interface SearchReturn {
  shouldSearchSkeleton: boolean;
  resultData: SearchResults | undefined;
}
