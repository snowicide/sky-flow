import type { CityData } from "@/types/api/CityData";
import type { HistoryItem } from "@/types/history";

export interface UseSearchHistoryReturn {
  recent: HistoryItem[];
  favorites: HistoryItem[];
  addCity: (cityData: CityData, favorited?: boolean) => void;
  toggleFavorite: (id: string) => void;
  removeCity: (id: string) => void;
  removeFavorite: (id: string) => void;
}
