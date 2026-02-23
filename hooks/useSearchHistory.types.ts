import type { HistoryItem } from "@/components/SearchSection/SearchHistory.types";
import type { CityData } from "@/types/api/CityData";

export interface UseSearchHistoryReturn {
  recent: HistoryItem[];
  favorites: HistoryItem[];
  addCity: (cityData: CityData, favorited?: boolean) => void;
  toggleFavorite: (id: string) => void;
  removeCity: (id: string) => void;
  removeFavorite: (id: string) => void;
}
