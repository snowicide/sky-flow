import { startTransition, useCallback, useEffect, useState } from "react";
import type { HistoryItem } from "@/types/SearchHistory";
import { useSearchParams } from "next/navigation";

export function useSearchHistory() {
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<HistoryItem[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const saved = localStorage.getItem("weather-history");
    if (saved) {
      const data = JSON.parse(saved);
      startTransition(() => setRecent(data));
      startTransition(() =>
        setFavorites(data.filter((item: HistoryItem) => item.isFavorite)),
      );
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("weather-history", JSON.stringify(recent));
    startTransition(() =>
      setFavorites(recent.filter((item) => item.isFavorite)),
    );
  }, [recent]);

  const addCity = useCallback((city: string, country: string) => {
    const id = `${city.toLocaleLowerCase()}-${country.toLocaleLowerCase()}`;

    setRecent((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      const newItem: HistoryItem = {
        id,
        city,
        country,
        isFavorite: false,
        timestamp: Date.now(),
      };

      return [newItem, ...filtered].slice(0, 8);
    });
  }, []);

  const toggleFavorite = useCallback(
    (id: string, isFeatured: boolean) =>
      setRecent((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isFavorite: !isFeatured } : item,
        ),
      ),
    [],
  );

  const removeCity = useCallback(
    (id: string) => setRecent((prev) => prev.filter((item) => item.id !== id)),
    [],
  );

  const removeFavorite = useCallback(
    (id: string) =>
      setFavorites((prev) => prev.filter((item) => item.id !== id)),
    [],
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
