import {
  QueryClient,
  QueryClientProvider,
  UseQueryOptions,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import type { WeatherData } from "@/types/api/WeatherData";
import { AppError } from "@/types/errors";
import type { CityData } from "@/types/location";

import { useWeatherQuery } from "./useWeatherQuery";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useQuery: (options: UseQueryOptions) =>
      actual.useQuery({
        ...options,
        retry: false,
        retryDelay: 0,
      }),
  };
});

const mockFetchForecastData = vi.hoisted(() => vi.fn());
vi.mock("@/services/fetchForecastData", () => ({
  fetchForecastData: mockFetchForecastData,
}));

describe("useWeatherQuery", () => {
  const cityData = {
    status: "found",
    lat: 53.9,
    lon: 27.56667,
    city: "Minsk",
    country: "Belarus",
  } as CityData;
  const mockWeatherData: WeatherData = {
    current: {
      city: "Minsk",
      country: "Belarus",
    },
    daily: {
      temperature_2m_max: [-2],
    },
    hourly: {
      temperature_2m: [-2],
    },
    forecastUnits: {
      temperature: "°C",
    },
  } as WeatherData;

  beforeEach(() => {
    vi.clearAllMocks();
    testQueryClient.clear();
    mockFetchForecastData.mockClear();
  });

  it("should fetch data", async () => {
    mockFetchForecastData.mockResolvedValue(mockWeatherData);
    const { result } = renderHookWithClient(() => useWeatherQuery(cityData));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockWeatherData);
  });

  it("should handle API errors", async () => {
    const error = new AppError(
      "FORECAST_FAILED",
      "Server is temporarily unavailable...",
    );
    mockFetchForecastData.mockRejectedValue(error);

    const { result } = renderHookWithClient(() => useWeatherQuery(cityData));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
    expect((result.current.error as AppError).code).toBe("FORECAST_FAILED");
    expect(mockFetchForecastData).toHaveBeenCalled();
  });

  it("should handle network errors", async () => {
    const error = new AppError(
      "UNKNOWN_ERROR",
      "Check your network connection...",
    );
    mockFetchForecastData.mockRejectedValue(error);

    const { result } = renderHookWithClient(() => useWeatherQuery(cityData));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as AppError).code).toBe("UNKNOWN_ERROR");
    expect(mockFetchForecastData).toHaveBeenCalled();
  });

  it("shouldn't fetch when city is not found", async () => {
    const cityData: CityData = { status: "not-found", city: "nonExist123" };
    const { result } = renderHookWithClient(() => useWeatherQuery(cityData));

    expect(mockFetchForecastData).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("should handle abort signals", async () => {
    const abortError = new Error("AbortError");
    abortError.name = "AbortError";
    mockFetchForecastData.mockRejectedValue(abortError);

    const { result } = renderHookWithClient(() => useWeatherQuery(cityData));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(abortError);
  });
});

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      retryDelay: 0,
      gcTime: 0,
      staleTime: 0,
    },
  },
});

function renderHookWithClient<T>(hook: () => T) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
  return renderHook(hook, { wrapper });
}
