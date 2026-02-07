import { ActiveTab } from "@/components/SearchSection/SearchField.types";
import type { HistoryItem } from "@/components/SearchSection/SearchHistory.types";
import { create } from "zustand";

export interface SearchHistoryStore {
  recent: HistoryItem[];
  favorites: HistoryItem[];
  inputValue: string;
  currentTab: ActiveTab;
  isOpen: boolean;

  setRecent: (data: HistoryItem[]) => void;
  setFavorites: (data: HistoryItem[]) => void;
  setInputValue: (value: string) => void;
  setCurrentTab: (tab: ActiveTab) => void;
  setIsOpen: (value: boolean) => void;
}

export const useSearchHistoryStore = create<SearchHistoryStore>((set) => ({
  recent: [],
  favorites: [],
  inputValue: "",
  currentTab: "recent",
  isOpen: false,

  setRecent: (data: HistoryItem[]) => set({ recent: data }),
  setFavorites: (data: HistoryItem[]) => set({ favorites: data }),
  setInputValue: (value: string) => set({ inputValue: value }),
  setCurrentTab: (tab: ActiveTab) => set({ currentTab: tab }),
  setIsOpen: (value: boolean) => set({ isOpen: value }),
}));
