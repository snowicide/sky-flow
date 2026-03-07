import type { HistoryItem } from "@/types/history";

export const createHistoryCity = (
  overrides: Partial<HistoryItem> = {},
): HistoryItem[] => {
  return [
    {
      ...getHistoryData(),
      ...overrides,
    },
  ];
};

const getHistoryData = (): HistoryItem => ({
  id: "warsaw-poland",
  city: "Warsaw",
  country: "Poland",
  isFavorite: false,
  timestamp: 123,
  latitude: 52.22977,
  longitude: 21.01178,
});
