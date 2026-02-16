import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Units {
  temp: "celsius" | "fahrenheit";
  speed: "kmh" | "mph";
  precipitation: "mm" | "inch";
}
export interface SettingsStore {
  units: Units;

  setUnits: (update: Partial<Units> | ((prev: Units) => Units)) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      units: {
        temp: "celsius",
        speed: "kmh",
        precipitation: "mm",
      },

      setUnits: (update: Partial<Units> | ((prev: Units) => Units)) =>
        set((state) => ({
          units:
            typeof update === "function"
              ? update(state.units)
              : { ...state.units, ...update },
        })),

      reset: () =>
        set({
          units: {
            temp: "celsius",
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
