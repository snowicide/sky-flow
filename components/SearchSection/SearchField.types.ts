import type { HistoryItem } from "./SearchHistory.types";

export interface SearchDropdownProps {
  inputValue: string;
  setInputValue: (value: string) => void;
}

export interface RecentTabProps {
  data: HistoryItem;

  searchSelectedCity: (value: string) => void;
  toggleFavorite: (id: string, isFeatured: boolean) => void;
  removeCity: (id: string) => void;
}

export interface FeaturedTabProps {
  data: HistoryItem;

  searchSelectedCity: (value: string) => void;
  removeFavorite: (id: string) => void;
}

export type ActiveTab = "recent" | "featured";
