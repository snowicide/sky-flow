import { create } from "zustand";

interface WeatherState {
  isLoading: boolean;
  error: string | null;
  weatherData: object | null;
  searchText: string;
  lastCity: string;

  setWeatherData: (data: object, city?: string) => void;
  setSearchText: (value: string) => void;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
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
}));
