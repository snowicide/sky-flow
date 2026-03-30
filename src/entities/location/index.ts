// --- api/ ---
export { useSearchQuery } from "./api/useSearchQuery";
export { fetchGeoData } from "./api/location.api";
export type { GeoItemDto, GeoResponseDto } from "./api/dto";

// --- model/ ---
export { formatCityDisplay } from "./model/formatCityDisplay";
export { HistorySchema, HistoryItemSchema } from "./model/schema";

export {
  FoundCitySchema,
  NotFoundCitySchema,
  CityDataSchema,
  type CityData,
  type FoundCity,
  type NotFoundCity,
  isFoundCity,
  isNotFoundCity,
  type HistoryItem,
  type History,
  type SearchTabProps,
  type ActiveTab,
  type SearchStore,
} from "./model/types";

export {
  useSearchHistory,
  favoriteStore,
  recentStore,
} from "./model/useSearchHistory";
export { useSearchStore } from "./model/useSearchStore";
