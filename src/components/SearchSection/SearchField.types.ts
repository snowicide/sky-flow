import type { HistoryItem } from "./SearchHistory.types";

export interface SearchDropdownProps {
  inputValue: string;
  setInputValue: (value: string) => void;
}

export interface RecentTabProps {
  data: HistoryItem;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export interface FavoritesTabProps {
  data: HistoryItem;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export type ActiveTab = "recent" | "favorites";
