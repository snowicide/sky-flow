export interface HistoryItem {
  id: string;
  city: string;
  country: string;
  isFavorite: boolean;
  timestamp: number;
  latitude: number;
  longitude: number;
}

export interface SearchTabProps {
  data: HistoryItem;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export type ActiveTab = "recent" | "favorites";
