import { ActiveTab } from "@/components/SearchSection/SearchField.types";
import { create } from "zustand";

export interface SearchStore {
  inputValue: string;
  currentTab: ActiveTab;
  isOpen: boolean;

  setInputValue: (value: string) => void;
  setCurrentTab: (tab: ActiveTab) => void;
  setIsOpen: (value: boolean) => void;

  reset: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  inputValue: "",
  currentTab: "recent",
  isOpen: false,

  setInputValue: (value: string) => set({ inputValue: value }),
  setCurrentTab: (tab: ActiveTab) => set({ currentTab: tab }),
  setIsOpen: (value: boolean) => set({ isOpen: value }),

  reset: () =>
    set({
      inputValue: "",
      currentTab: "recent",
      isOpen: false,
    }),
}));
