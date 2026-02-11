import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSearchActions } from "./useSearchActions";
import { useSearchStore } from "@/stores/useSearchStore";
import { SearchInput } from "@/components/SearchSection/SearchBar";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { WeatherData } from "@/types/api/WeatherData";

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
vi.mock("@/hooks/useSearchHistory", () => ({
  useSearchHistory: () => ({
    addCity: mockAddCity,
    recent: [],
    favorites: [],
    toggleFavorites: vi.fn(),
    removeCity: vi.fn(),
  }),
}));

const mockFetchWeatherData = vi.hoisted(() => vi.fn());
vi.mock("@/services/fetchWeatherData", () => ({
  fetchWeatherData: mockFetchWeatherData,
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

function renderWithClient(element: React.ReactElement) {
  const queryClient = testQueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return render(element, { wrapper });
}

describe("useSearchActions", () => {
  let inputElement: HTMLElement;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddCity.mockClear();

    renderWithClient(<SearchInput />);
    inputElement = screen.getByRole("textbox", { name: /search/i });
    user = userEvent.setup();

    act(() => {
      useSearchStore.getState().reset();
    });
  });

  it("should open dropdown and handling value", async () => {
    await user.click(inputElement);
    expect(inputElement).toHaveFocus();
    await waitFor(() => expect(useSearchStore.getState().isOpen).toBe(true));

    await user.type(inputElement, "Berlin");
    expect(useSearchStore.getState().inputValue).toBe("Berlin");
  });

  it("should change active tab", () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    act(() => result.current.handleChangeTab("featured"));
    expect(useSearchStore.getState().currentTab).toBe("featured");

    act(() => result.current.handleChangeTab("recent"));
    expect(useSearchStore.getState().currentTab).toBe("recent");
  });

  it("should handling keydown", () => {
    const { result } = renderHookWithClient(() => useSearchActions());
    const mockRef = { current: inputElement as HTMLInputElement };

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
});

describe("API calls", () => {
  let mockWeatherData: WeatherData;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchWeatherData.mockClear();
    mockAddCity.mockClear();

    mockWeatherData = {
      current: {
        time: "2026-02-11T14:15",
        temperature_2m: -2.6,
        weather_code: 3,
        city: "Minsk",
        country: "Belarus",
      },
      daily: {
        time: ["2026-02-11"],
        temperature_2m_max: [-0.4],
        weather_code: [71],
      },
      hourly: {
        time: ["2026-02-11T00:00"],
        temperature_2m: [-7.5],
        weather_code: [71],
      },
    } as WeatherData;
  });

  it("should fetch weather data, add to history and change URL", async () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    mockFetchWeatherData.mockResolvedValue({
      success: true,
      data: mockWeatherData,
    });

    await act(async () => await result.current.searchSelectedCity("Minsk"));

    expect(mockFetchWeatherData).toHaveBeenCalledTimes(1);
    expect(mockFetchWeatherData).toHaveBeenCalledWith("minsk");

    expect(mockAddCity).toHaveBeenCalledTimes(1);
    expect(mockAddCity).toHaveBeenCalledWith("minsk", "belarus");

    expect(mockPush).toHaveBeenLastCalledWith(
      expect.stringContaining("city=minsk"),
    );
  });

  it("should handle city not found", async () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    mockFetchWeatherData.mockResolvedValue({
      success: false,
      error: {
        code: "GEOCODING_FAILED",
        message: "City not found",
      },
    });

    await act(
      async () => await result.current.searchSelectedCity("NonExist123"),
    );

    expect(mockFetchWeatherData).toHaveBeenCalledTimes(1);
    expect(mockFetchWeatherData).toHaveBeenCalledWith("nonexist123");
    expect(mockAddCity).not.toHaveBeenCalled();
  });

  it("should handle fetchWeatherData throwing an error", async () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    mockFetchWeatherData.mockRejectedValue(new Error("NETWORK_ERROR"));

    await act(async () => {
      try {
        await result.current.searchSelectedCity("Minsk");
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe("NETWORK_ERROR");
        } else {
          throw new Error("UNKNOWN_ERROR");
        }
      }
    });

    expect(mockAddCity).not.toHaveBeenCalled();
  });

  it("shouldn't fetch when empty input", async () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    act(() => useSearchStore.getState().setInputValue(""));
    await act(
      async () =>
        await result.current.searchSelectedCity(
          useSearchStore.getState().inputValue,
        ),
    );

    expect(mockFetchWeatherData).not.toHaveBeenCalled();
  });
});
