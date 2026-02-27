import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSearchStore } from "@/stores/useSearchStore";

import { useSearchActions } from "./useSearchActions";

import "@testing-library/jest-dom";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

const mockAddCity = vi.hoisted(() => vi.fn());
vi.mock("@/components/SearchSection/hooks/useSearchHistory", () => ({
  useSearchHistory: () => ({
    addCity: mockAddCity,
    recent: [],
    favorites: [],
    toggleFavorites: vi.fn(),
    removeCity: vi.fn(),
  }),
}));

const mockFetchGeoData = vi.hoisted(() => vi.fn());
vi.mock("@/services/fetchGeoData", () => ({
  fetchGeoData: mockFetchGeoData,
}));

const testQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

function renderHookWithClient<T>(hook: () => T) {
  const queryClient = testQueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(hook, { wrapper });
}

describe("useSearchActions", () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddCity.mockClear();
    mockFetchGeoData.mockClear();

    inputElement = document.createElement("input");
    inputElement.setAttribute("aria-label", "search");
    document.body.appendChild(inputElement);

    mockFetchGeoData.mockResolvedValue({
      results: [
        {
          name: "Minsk",
          country: "Belarus",
          latitude: 53.9,
          longitude: 27.56667,
        },
      ],
    });

    act(() => {
      useSearchStore.getState().reset();
    });
  });

  afterAll(() => {
    document.body.removeChild(inputElement);
  });

  it("should change active tab", () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    act(() => result.current.handleChangeTab("favorites"));
    expect(useSearchStore.getState().currentTab).toBe("favorites");

    act(() => result.current.handleChangeTab("recent"));
    expect(useSearchStore.getState().currentTab).toBe("recent");
  });

  it("should handling keydown", () => {
    const { result } = renderHookWithClient(() => useSearchActions());
    const mockRef = { current: inputElement };

    const enterEvent = {
      key: "Enter",
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    const escapeEvent = {
      key: "Escape",
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;
    inputElement.focus();

    act(() => useSearchStore.getState().setInputValue("Berlin"));
    expect(useSearchStore.getState().inputValue).toBe("Berlin");

    act(() => result.current.handleKeydown(escapeEvent, mockRef));
    expect(useSearchStore.getState().inputValue).toBe("Berlin");
    expect(document.activeElement).not.toBe(inputElement);

    inputElement.focus();

    act(() => result.current.handleKeydown(enterEvent, mockRef));
    expect(useSearchStore.getState().inputValue).toBe("");
    expect(document.activeElement).not.toBe(inputElement);
  });

  it("should change URL", async () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    const cityData = {
      city: "Minsk",
      country: "Belarus",
      lat: 53.9,
      lon: 27.56667,
    };

    result.current.searchSelectedCity(cityData, {
      current: inputElement,
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(
          "city=Minsk&country=Belarus&lat=53.9&lon=27.56667",
        ),
      );
      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockAddCity).toHaveBeenCalledTimes(1);
      expect(mockAddCity).toHaveBeenCalledWith(cityData);
    });

    expect(useSearchStore.getState().inputValue).toBe("");
  });

  it("should find first city from input", async () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    await act(async () => await result.current.searchCityWithName("Berlin"));

    expect(mockFetchGeoData).toHaveBeenCalledTimes(1);
    expect(mockFetchGeoData).toHaveBeenCalledWith("berlin");
  });

  it("shouldn't navigate when input is empty", () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    act(() => result.current.searchCityWithName(""));
    expect(mockFetchGeoData).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
