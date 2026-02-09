import type { HistoryItem } from "@/components/SearchSection/SearchHistory.types";
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
      this.data = saved ? JSON.parse(saved) : [];
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

  update(newData: HistoryItem[]) {
    this.data = newData;
    localStorage.setItem(this.storageKey, JSON.stringify(newData));
    this.listeners.forEach((listener) => listener());
  }

  reset() {
    const saved = localStorage.getItem(this.storageKey);
    this.data = saved ? JSON.parse(saved) : [];
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
    (city: string, country: string) => {
      const id = `${city.toLowerCase()}-${country.toLowerCase()}`;

      const newItem = {
        id,
        city: city.trim(),
        country: country.trim(),
        isFavorite: false,
        timestamp: Date.now(),
      };

      const newData = [
        newItem,
        ...recent.filter((item) => item.id !== id),
      ].slice(0, 8);

      recentStore.update(newData);
    },
    [recent],
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
