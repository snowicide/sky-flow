import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { WeatherDataUnits } from "@/types/api/WeatherData";

export interface SettingsStore {
  units: WeatherDataUnits;
  selectedDayIndex: number;

  setUnits: (
    update:
      | Partial<WeatherDataUnits>
      | ((prev: WeatherDataUnits) => WeatherDataUnits),
  ) => void;
  setSelectedDayIndex: (day: number) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      units: {
        temperature: "celsius",
        speed: "kmh",
        precipitation: "mm",
        time: "12",
      },
      selectedDayIndex: 0,

      setUnits: (
        update:
          | Partial<WeatherDataUnits>
          | ((prev: WeatherDataUnits) => WeatherDataUnits),
      ) =>
        set((state) => ({
          units:
            typeof update === "function"
              ? update(state.units)
              : { ...state.units, ...update },
        })),

      setSelectedDayIndex: (day: number) => set({ selectedDayIndex: day }),

      reset: () =>
        set({
          units: {
            temperature: "celsius",
            speed: "kmh",
            precipitation: "mm",
            time: "12",
          },
        }),
    }),
    {
      name: "weather-settings",
    },
  ),
);
