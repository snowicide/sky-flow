import { ActiveTab } from "@/components/SearchSection/SearchField.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SearchStore {
  inputValue: string;
  currentTab: ActiveTab;
  isOpen: boolean;
  _hasHydrated: boolean;

  setInputValue: (value: string) => void;
  setCurrentTab: (tab: ActiveTab) => void;
  setIsOpen: (value: boolean) => void;

  setHasHydrated: (state: boolean) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      inputValue: "",
      currentTab: "recent",
      isOpen: false,
      _hasHydrated: false,

      setInputValue: (value: string) => set({ inputValue: value }),
      setCurrentTab: (tab: ActiveTab) => set({ currentTab: tab }),
      setIsOpen: (value: boolean) => set({ isOpen: value }),

      reset: () =>
        set({
          inputValue: "",
          currentTab: "recent",
          isOpen: false,
        }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "search-hydration",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
