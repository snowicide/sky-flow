import { renderHook, waitFor } from "@testing-library/react";
import { useWeatherQuery } from "./useWeatherQuery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppError } from "@/types/errors";
import type { WeatherData } from "@/types/api/WeatherData";

const mockFetchWeatherData = vi.hoisted(() => vi.fn());
vi.mock("@/services/fetchWeatherData", () => ({
  fetchWeatherData: mockFetchWeatherData,
}));

const mockAddCity = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/useSearchHistory", () => ({
  useSearchHistory: () => ({
    addCity: mockAddCity,
  }),
}));

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

describe("useWeatherQuery", () => {
  let city: string;
  let mockWeatherData: WeatherData;

  beforeEach(() => {
    vi.clearAllMocks();
    testQueryClient.clear();
    mockAddCity.mockClear();
    mockFetchWeatherData.mockClear();

    city = "Minsk";

    mockWeatherData = {
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
    } as WeatherData;
  });

  it("should fetch data and add recent city on success", async () => {
    mockFetchWeatherData.mockResolvedValue(mockWeatherData);
    const { result } = renderHookWithClient(() => useWeatherQuery(city));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockWeatherData);
    expect(mockAddCity).toHaveBeenCalledWith("minsk", "belarus");
  });

  it("shouldn't retry when not found or aborted", async () => {
    const notFoundError = new AppError(
      "GEOCODING_FAILED",
      `City ${city} not found...`,
    );
    mockFetchWeatherData.mockRejectedValue(notFoundError);

    const { result } = renderHookWithClient(() => useWeatherQuery(city));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(notFoundError);
    expect((result.current.error as AppError).code).toBe("GEOCODING_FAILED");

    expect(result.current.failureCount).toBe(1);
    expect(mockFetchWeatherData).toHaveBeenCalledTimes(1);
  });
});
