import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_CITY_DATA } from "@/app/weather/constants";

import { FoundCitySchema } from "./types";
import type { ActiveTab, SearchStore } from "./types";

const initialState = {
  inputValue: "",
  currentTab: "recent" as const,
  isOpen: false,
  _hasHydrated: false,
  lastValidatedCity: DEFAULT_CITY_DATA,
};

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      ...initialState,

      setInputValue: (value: string) => set({ inputValue: value }),
      setCurrentTab: (tab: ActiveTab) => set({ currentTab: tab }),
      setIsOpen: (value: boolean) => set({ isOpen: value }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setLastValidatedCity: (cityData) => {
        const { data, success } = FoundCitySchema.safeParse(cityData);
        if (success) set({ lastValidatedCity: data });
      },

      reset: () => set(initialState),
    }),
    {
      name: "weather-search",
      partialize: (s) => ({
        lastValidatedCity: s.lastValidatedCity,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      version: 1,
    },
  ),
);
