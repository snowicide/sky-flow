import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  favoriteStore,
  recentStore,
  useSearchHistory,
} from "./useSearchHistory";

describe("useSearchHistory", () => {
  beforeEach(() => {
    window.localStorage.clear();
    recentStore.reset();
    favoriteStore.reset();
  });

  it("should get recent from localStorage", () => {
    const mockData = [
      {
        id: "warsaw-poland",
        city: "Warsaw",
        country: "Poland",
        isFavorite: false,
      },
    ];

    window.localStorage.setItem("weather-recent", JSON.stringify(mockData));
    recentStore.reset();
    const { result } = renderHook(() => useSearchHistory());
    const { recent } = result.current;

    expect(recent).toHaveLength(1);
    expect(recent[0].city).toBe("Warsaw");
    expect(recent[0].id).toBe("warsaw-poland");
  });

  it("should get favorites from localStorage", () => {
    const mockData = [
      {
        id: "warsaw-poland",
        city: "Warsaw",
        country: "Poland",
        isFavorite: true,
      },
    ];

    window.localStorage.setItem("weather-favorite", JSON.stringify(mockData));
    favoriteStore.reset();
    const { result } = renderHook(() => useSearchHistory());
    const { favorites } = result.current;

    expect(favorites).toHaveLength(1);
    expect(favorites[0].city).toBe("Warsaw");
    expect(favorites[0].id).toBe("warsaw-poland");
    expect(favorites[0].isFavorite).toBe(true);
  });

  it("should add a new city to the recent", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity("Berlin", "Germany"));

    expect(result.current.recent).toHaveLength(1);
    expect(result.current.recent[0]).toMatchObject({
      id: "berlin-germany",
      city: "Berlin",
      country: "Germany",
      isFavorite: false,
    });

    const saved = JSON.parse(
      window.localStorage.getItem("weather-recent") || "[]",
    );
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe("berlin-germany");
  });

  it("shouldn't duplicate the same city", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity("Tokyo", "Japan"));
    act(() => result.current.addCity("Tokyo", "Japan"));

    expect(result.current.recent).toHaveLength(1);
  });

  it("should have maximum 8 cities", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity("Minsk", "Belarus"));
    act(() => result.current.addCity("Tokyo", "Japan"));
    act(() => result.current.addCity("London", "United Kingdom"));
    act(() => result.current.addCity("Berlin", "Germany"));
    act(() => result.current.addCity("Paris", "France"));
    act(() => result.current.addCity("Warsaw", "Poland"));
    act(() => result.current.addCity("Moscow", "Russia"));
    act(() => result.current.addCity("Bern", "Switzerland"));
    act(() => result.current.addCity("Rome", "Italy"));

    expect(result.current.recent).toHaveLength(8);
    expect(result.current.recent[result.current.recent.length - 1].id).toBe(
      "tokyo-japan",
    );
  });

  it("should toggle favorite", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity("Warsaw", "Poland"));
    const id = result.current.recent[0].id;
    act(() => result.current.toggleFavorite(id));

    expect(result.current.recent[0].isFavorite).toBe(true);
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].city).toBe("Warsaw");
    expect(result.current.favorites[0].isFavorite).toBe(true);

    act(() => result.current.toggleFavorite(id));

    expect(result.current.recent[0].isFavorite).toBe(false);
    expect(result.current.favorites).toHaveLength(0);
  });

  it("should remove city from recent", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity("Paris", "France"));
    act(() => result.current.addCity("Berlin", "Germany"));
    const berlinId = result.current.recent[0].id;

    expect(result.current.recent).toHaveLength(2);
    expect(result.current.recent[0].id).toBe(berlinId);

    act(() => result.current.removeCity(berlinId));

    expect(result.current.recent).toHaveLength(1);
    expect(result.current.recent[0].city).toBe("Paris");
  });

  it("should remove from favorite in favorite tab", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity("Minsk", "Belarus"));
    act(() => result.current.addCity("Berlin", "Germany"));
    act(() => result.current.addCity("Warsaw", "Poland"));
    const warsawId = result.current.recent[0].id;
    const berlinId = result.current.recent[1].id;
    const minskId = result.current.recent[2].id;
    act(() => result.current.toggleFavorite(warsawId));
    act(() => result.current.toggleFavorite(berlinId));
    act(() => result.current.toggleFavorite(minskId));
    act(() => result.current.removeFavorite(berlinId));

    expect(result.current.recent).toHaveLength(3);
    expect(result.current.favorites).toHaveLength(2);
    expect(result.current.recent[0].isFavorite).toBe(true);
    expect(result.current.recent[1].isFavorite).toBe(false);
    expect(result.current.recent[2].isFavorite).toBe(true);
  });

  it("should handle corrupted localStorage", () => {
    window.localStorage.setItem("weather-recent", "broken json");
    recentStore.reset();
    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.recent).toEqual([]);
  });
});
