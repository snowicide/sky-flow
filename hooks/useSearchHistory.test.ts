import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  favoriteStore,
  recentStore,
  useSearchHistory,
} from "./useSearchHistory";
import type { CityData } from "@/types/api/CityData";

describe("useSearchHistory", () => {
  let minskData: CityData;
  let berlinData: CityData;
  let warsawData: CityData;
  let parisData: CityData;

  beforeEach(() => {
    window.localStorage.clear();
    recentStore.reset();
    favoriteStore.reset();

    minskData = {
      city: "Minsk",
      country: "Belarus",
      lat: 53.9,
      lon: 27.56667,
    };
    berlinData = {
      city: "Berlin",
      country: "Germany",
      lat: 52.52437,
      lon: 13.41053,
    };
    warsawData = {
      city: "Warsaw",
      country: "Poland",
      lat: 52.22977,
      lon: 21.01178,
    };
    parisData = {
      city: "Paris",
      country: "France",
      lat: 48.85341,
      lon: 2.3488,
    };
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

    act(() => result.current.addCity(berlinData));

    expect(result.current.recent).toHaveLength(1);
    expect(result.current.recent[0]).toMatchObject({
      id: "berlin-germany",
      city: "berlin",
      country: "germany",
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

    act(() => result.current.addCity(berlinData));
    act(() => result.current.addCity(berlinData));

    expect(result.current.recent).toHaveLength(1);
  });

  it("should have maximum 8 cities", () => {
    const { result } = renderHook(() => useSearchHistory());

    const tokyoData = {
      city: "Tokyo",
      country: "Japan",
      lat: 35.6895,
      lon: 139.69171,
    };
    const londonData = {
      city: "London",
      country: "United Kingdom",
      lat: 51.50853,
      lon: -0.12574,
    };
    const moscowData = {
      city: "Moscow",
      country: "Russia",
      lat: 55.75222,
      lon: 37.61556,
    };
    const romeData = {
      city: "Rome",
      country: "Italy",
      lat: 41.89193,
      lon: 12.51133,
    };
    const bernData = {
      city: "Bern",
      country: "Switzerland",
      lat: 46.94809,
      lon: 7.44744,
    };

    act(() => result.current.addCity(minskData));
    act(() => result.current.addCity(tokyoData));
    act(() => result.current.addCity(londonData));
    act(() => result.current.addCity(berlinData));
    act(() => result.current.addCity(parisData));
    act(() => result.current.addCity(warsawData));
    act(() => result.current.addCity(moscowData));
    act(() => result.current.addCity(bernData));
    act(() => result.current.addCity(romeData));

    expect(result.current.recent).toHaveLength(8);
    expect(result.current.recent[result.current.recent.length - 1].id).toBe(
      "tokyo-japan",
    );
  });

  it("should toggle favorite", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity(warsawData));
    const id = result.current.recent[0].id;
    act(() => result.current.toggleFavorite(id));

    expect(result.current.recent[0].isFavorite).toBe(true);
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].city).toBe("warsaw");
    expect(result.current.favorites[0].isFavorite).toBe(true);

    act(() => result.current.toggleFavorite(id));

    expect(result.current.recent[0].isFavorite).toBe(false);
    expect(result.current.favorites).toHaveLength(0);
  });

  it("should remove city from recent", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity(parisData));
    act(() => result.current.addCity(berlinData));
    const berlinId = result.current.recent[0].id;

    expect(result.current.recent).toHaveLength(2);
    expect(result.current.recent[0].id).toBe(berlinId);

    act(() => result.current.removeCity(berlinId));

    expect(result.current.recent).toHaveLength(1);
    expect(result.current.recent[0].city).toBe("paris");
  });

  it("should remove from favorite in favorite tab", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity(minskData));
    act(() => result.current.addCity(berlinData));
    act(() => result.current.addCity(warsawData));
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
