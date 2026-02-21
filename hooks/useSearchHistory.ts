import type { HistoryItem } from "@/components/SearchSection/SearchHistory.types";
import type { CityData } from "@/types/api/CityData";
import { useCallback, useSyncExternalStore } from "react";

class WeatherStore {
  private data: HistoryItem[] = [];
  private listeners = new Set<() => void>();
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) {
        this.data = parsed;
      } else {
        this.data = [];
      }
    } catch {
      this.data = [];
    }
  }

  getSnapshot() {
    return this.data;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  update(newData: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])) {
    if (typeof newData === "function") {
      this.data = newData(this.data);
    } else {
      this.data = newData;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    this.listeners.forEach((listener) => listener());
  }

  reset() {
    this.loadFromStorage();
    this.listeners.forEach((listener) => listener());
  }
}

export const recentStore = new WeatherStore("weather-recent");
export const favoriteStore = new WeatherStore("weather-favorite");
const EMPTY_ARRAY: [] = [];

export function useSearchHistory() {
  const recent = useSyncExternalStore(
    (listener) => recentStore.subscribe(listener),
    () => recentStore.getSnapshot(),
    () => EMPTY_ARRAY,
  );

  const favorites = useSyncExternalStore(
    (listener) => favoriteStore.subscribe(listener),
    () => favoriteStore.getSnapshot(),
    () => EMPTY_ARRAY,
  );

  const addCity = useCallback(
    (cityData: CityData, favorited?: boolean) => {
      const { lat, lon } = cityData;
      const isFavorited = favorites.some(
        (item) => item.latitude === lat && item.longitude === lon,
      );
      recentStore.update((prev: HistoryItem[]) => {
        const { city, country } = cityData;
        const id = `${city.toLowerCase()}-${country.toLowerCase()}`;

        const newItem: HistoryItem = {
          id,
          city: city.trim().toLowerCase(),
          country: country.trim().toLowerCase(),
          isFavorite: isFavorited || (!!favorited && favorited),
          timestamp: Date.now(),
          latitude: lat,
          longitude: lon,
        };

        const newData: HistoryItem[] = [
          newItem,
          ...prev.filter((item) => item.id !== id),
        ].slice(0, 8);

        return newData;
      });
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const newData = recent.map((item: HistoryItem) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      );
      recentStore.update(newData);

      const allFavorites = newData.filter((item) => item.isFavorite);
      favoriteStore.update([
        ...favorites.filter((item) => item.id !== id),
        ...allFavorites.filter((item) => item.id === id),
      ]);
    },
    [recent, favorites],
  );

  const removeCity = useCallback(
    (id: string) => {
      const newData = recent.filter((item: HistoryItem) => item.id !== id);

      recentStore.update(newData);
    },
    [recent],
  );

  const removeFavorite = useCallback(
    (id: string) => {
      const newFavorites = favorites.filter((item) => item.id !== id);
      favoriteStore.update(newFavorites);

      const newRecent = recent.map((item) =>
        item.id === id ? { ...item, isFavorite: false } : item,
      );
      recentStore.update(newRecent);
    },
    [recent, favorites],
  );

  return {
    recent,
    favorites,
    addCity,
    toggleFavorite,
    removeCity,
    removeFavorite,
  };
}
