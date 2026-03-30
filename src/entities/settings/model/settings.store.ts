import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Units } from "@/entities/weather";

import { migrateSettings } from "./settings.lib";
import type { SettingsStore } from "./settings.types";

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      units: {
        temperatureUnit: "celsius",
        speedUnit: "kmh",
        precipitationUnit: "mm",
        timeUnit: "12",
      },
      selectedDayIndex: 0,

      setUnits: (update: Partial<Units> | ((prev: Units) => Units)) =>
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
            temperatureUnit: "celsius",
            speedUnit: "kmh",
            precipitationUnit: "mm",
            timeUnit: "12",
          },
        }),
    }),
    {
      name: "weather-settings",
      version: 1,
      migrate: (persistedState: unknown, version: number) =>
        migrateSettings(persistedState, version),
      partialize: (s) => ({
        units: s.units,
      }),
    },
  ),
);
