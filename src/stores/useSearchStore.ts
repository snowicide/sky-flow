import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_CITY_DATA } from "@/app/weather/constants";
import type { ActiveTab } from "@/types/history";
import { isNotFoundCity, type CityData } from "@/types/location";

export interface SearchStore {
  inputValue: string;
  currentTab: ActiveTab;
  isOpen: boolean;
  _hasHydrated: boolean;
  lastValidatedCity: CityData;

  setInputValue: (value: string) => void;
  setCurrentTab: (tab: ActiveTab) => void;
  setIsOpen: (value: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  setLastValidatedCity: (cityData: CityData) => void;

  reset: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      inputValue: "",
      currentTab: "recent",
      isOpen: false,
      _hasHydrated: false,
      lastValidatedCity: DEFAULT_CITY_DATA,

      setInputValue: (value: string) => set({ inputValue: value }),
      setCurrentTab: (tab: ActiveTab) => set({ currentTab: tab }),
      setIsOpen: (value: boolean) => set({ isOpen: value }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setLastValidatedCity: (cityData) => {
        if (isNotFoundCity(cityData)) return;
        set({ lastValidatedCity: cityData });
      },

      reset: () =>
        set({
          inputValue: "",
          currentTab: "recent",
          isOpen: false,
          _hasHydrated: false,
          lastValidatedCity: DEFAULT_CITY_DATA,
        }),
    }),
    {
      name: "search-hydration",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
