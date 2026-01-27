import { create } from "zustand";
import { WeatherData } from "@/types/WeatherData";
import { createJSONStorage, persist } from "zustand/middleware";

interface WeatherState {
  isLoading: boolean;
  error: string | null;
  weatherData: WeatherData | null;
  searchText: string;
  lastCity: string;

  setWeatherData: (data: WeatherData, city?: string) => void;
  setSearchText: (value: string) => void;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      weatherData: null,
      lastCity: "Minsk",
      searchText: "",
      isLoading: false,
      error: null,

      setLoading: (value) => set({ isLoading: value }),
      setError: (value) => set({ error: value }),
      setWeatherData: (data, city) =>
        set({
          weatherData: data,
          lastCity: city || "Minsk",
        }),

      setSearchText: (value) => set({ searchText: value }),
    }),
    {
      name: "weather-store",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        WeatherData: state.weatherData,
        lastCity: state.lastCity,
      }),
    },
  ),
);
