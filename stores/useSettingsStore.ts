import type { WeatherDataUnits } from "@/types/api/WeatherData";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SettingsStore {
  units: WeatherDataUnits;

  setUnits: (
    update:
      | Partial<WeatherDataUnits>
      | ((prev: WeatherDataUnits) => WeatherDataUnits),
  ) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      units: {
        temperature: "celsius",
        speed: "kmh",
        precipitation: "mm",
      },

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

      reset: () =>
        set({
          units: {
            temperature: "celsius",
            speed: "kmh",
            precipitation: "mm",
          },
        }),
    }),
    {
      name: "weather-settings",
    },
  ),
);
