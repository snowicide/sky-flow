import type { HistoryItem } from "@/components/SearchSection/SearchHistory.types";
import { useCallback, useSyncExternalStore } from "react";

class WeatherRecentStore {
  private recentData: HistoryItem[] = [];
  private listeners = new Set<() => void>();

  constructor() {
    try {
      const saved = localStorage.getItem("weather-recent");
      this.recentData = saved ? JSON.parse(saved) : [];
    } catch {
      this.recentData = [];
    }
  }

  getSnapshot() {
    return this.recentData;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  update(newData: HistoryItem[]) {
    this.recentData = newData;
    localStorage.setItem("weather-recent", JSON.stringify(newData));
    this.listeners.forEach((listener) => listener());
  }

  addCity(city: string, country: string) {
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
      ...this.recentData.filter((item) => item.id !== id),
    ].slice(0, 8);

    this.update(newData);
  }
}

class WeatherFavoriteStore {
  private favoriteData: HistoryItem[] = [];
  private listeners = new Set<() => void>();

  constructor() {
    try {
      const saved = localStorage.getItem("weather-favorite");
      this.favoriteData = saved ? JSON.parse(saved) : [];
    } catch {
      this.favoriteData = [];
    }
  }

  getSnapshot() {
    return this.favoriteData;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  update(newData: HistoryItem[]) {
    this.favoriteData = newData;
    localStorage.setItem("weather-favorite", JSON.stringify(newData));
    this.listeners.forEach((listener) => listener());
  }

  addCity(city: string, country: string) {
    const id = `${city.trim()}-${country.trim()}`;

    const newItem = {
      id,
      city: city.trim(),
      country: country.trim(),
      isFavorite: true,
      timestamp: Date.now(),
    };

    const newData = [
      newItem,
      ...this.favoriteData.filter((item) => item.id !== id),
    ];

    this.update(newData);
  }
}

const recentStore = new WeatherRecentStore();
const favoriteStore = new WeatherFavoriteStore();

export function useSearchHistory() {
  const recent = useSyncExternalStore(
    (listener) => recentStore.subscribe(listener),
    () => recentStore.getSnapshot(),
    () => recentStore.getSnapshot(),
  );

  const favorites = useSyncExternalStore(
    (listener) => favoriteStore.subscribe(listener),
    () => favoriteStore.getSnapshot(),
    () => favoriteStore.getSnapshot(),
  );

  const addCity = useCallback(
    (city: string, country: string) => recentStore.addCity(city, country),
    [],
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
      const newData = favorites.filter((item) => item.id !== id);
      const currentRecentCity = recent.find((item) => item.id === id);

      if (currentRecentCity) {
        recentStore.update([
          { ...currentRecentCity, isFavorite: false },
          ...recent.filter((item) => item.id !== id),
        ]);
      }
      favoriteStore.update(newData);
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
