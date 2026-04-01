import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { type CityData, useSearchStore } from "@/entities/location";
import { createCityData } from "@/shared/lib/testing";
import { createGeoData } from "@/shared/lib/testing";

import { useSearchActions } from "../useSearchActions";

import "@testing-library/jest-dom";

// --- 1. mocks ---
const { mocks } = vi.hoisted(() => {
  const push = vi.fn();
  const addCity = vi.fn();
  const fetchGeoData = vi.fn();

  return {
    mocks: {
      navigation: {
        push,
        routerModule: () => ({ push: push }),
        pathnameModule: { usePathname: vi.fn(() => "/") },
        searchParamsModule: {
          useSearchParams: vi.fn(() => new URLSearchParams()),
        },
      },
      hooks: {
        addCity,
        historyModule: { useSearchHistory: () => ({ addCity }) },
      },
      services: {
        fetchGeoData,
        geoModule: { fetchGeoData },
      },
    },
  };
});
vi.mock("next/navigation", async () => {
  return {
    useRouter: () => mocks.navigation.routerModule(),
    usePathname: mocks.navigation.pathnameModule.usePathname,
    useSearchParams: mocks.navigation.searchParamsModule.useSearchParams,
  };
});
vi.mock("@/entities/location", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/location")>();
  return {
    ...actual,
    useSearchHistory: () => ({ addCity: mocks.hooks.addCity }),
    fetchGeoData: mocks.services.fetchGeoData,
    useSearchStore: actual.useSearchStore,
  };
});

// --- 2. tests ---
describe("useSearchActions", () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.services.fetchGeoData.mockClear();
    mocks.navigation.push.mockClear();
    mocks.hooks.addCity.mockClear();

    inputElement = document.createElement("input");
    inputElement.setAttribute("aria-label", "search");
    document.body.appendChild(inputElement);

    act(() => {
      useSearchStore.getState().reset();
    });
  });

  afterEach(() => {
    document.body.removeChild(inputElement);
  });

  describe("searchSelectedCity", () => {
    it("should change URL, call addCity and blur", async () => {
      const { result } = renderHook(() => useSearchActions());
      const { berlinCityData } = createCityData();

      act(() =>
        result.current.searchSelectedCity(berlinCityData, {
          current: inputElement,
        }),
      );

      await waitFor(() => {
        expect(mocks.navigation.push).toHaveBeenCalledTimes(1);
        expect(mocks.navigation.push).toHaveBeenCalledWith(
          expect.stringContaining(
            "/?city=Berlin&region=State+of+Berlin&country=Germany&code=PPLC&lat=52.52437&lon=13.41053",
          ),
        );
        expect(mocks.navigation.push).toHaveBeenCalledTimes(1);
        expect(mocks.hooks.addCity).toHaveBeenCalledTimes(1);
        expect(mocks.hooks.addCity).toHaveBeenCalledWith(berlinCityData);
      });
      expect(document.activeElement).not.toBe(inputElement);
      expect(useSearchStore.getState().inputValue).toBe("");
    });

    it("shouldn't call addCity when city not found", async () => {
      const { result } = renderHook(() => useSearchActions());
      const city: CityData = { status: "not-found", city: "123" };

      act(() =>
        result.current.searchSelectedCity(city, { current: inputElement }),
      );
      await waitFor(() =>
        expect(mocks.navigation.push).toHaveBeenCalledTimes(1),
      );
      expect(mocks.navigation.push).toHaveBeenCalledWith("/?city=123");
      expect(mocks.hooks.addCity).not.toHaveBeenCalled();
    });
  });

  describe("searchCityWithName", () => {
    it("should find first city from input", async () => {
      const geoData = createGeoData();
      mocks.services.fetchGeoData.mockResolvedValue(geoData);

      const { result } = renderHook(() => useSearchActions());

      await act(async () => await result.current.searchCityWithName("Berlin"));

      await waitFor(() =>
        expect(mocks.navigation.push).toHaveBeenCalledTimes(1),
      );
    });

    it("shouldn't navigate when input is empty", async () => {
      const { result } = renderHook(() => useSearchActions());

      const spy = vi.spyOn(result.current, "searchSelectedCity");

      await act(async () => await result.current.searchCityWithName(""));

      expect(spy).not.toHaveBeenCalled();
      expect(mocks.navigation.push).not.toHaveBeenCalled();
    });
  });
});
