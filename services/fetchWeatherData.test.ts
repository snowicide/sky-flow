import { AppError } from "@/types/errors";
import { fetchWeatherData } from "./fetchWeatherData";
import { vi } from "vitest";

describe("fetchWeatherData", () => {
  let city: string;
  let geoData: {
    generationtime_ms: number;
    results: {
      name: string;
      country: string;
      latitude: number;
      longitude: number;
    }[];
  };
  let forecastData: {
    current: object;
    daily: object;
    hourly: object;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    city = "Berlin";
    vi.stubGlobal("fetch", vi.fn());

    geoData = {
      generationtime_ms: 0.05,
      results: [
        {
          name: "Berlin",
          country: "Germany",
          latitude: 52.5,
          longitude: 13.4,
        },
      ],
    };
    forecastData = {
      current: { city: "Berlin", country: "Germany" },
      daily: {},
      hourly: {},
    };
  });

  it("should fetch geocoding and then fetch weather data", async () => {
    const fetchMock = vi.mocked(global.fetch);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => geoData,
    } as Response);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => forecastData,
    } as Response);

    const data = await fetchWeatherData(city, undefined);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    expect(fetchMock.mock.calls[0][0]).toContain(
      "geocoding-api.open-meteo.com",
    );
    expect(fetchMock.mock.calls[0].length).toBe(2);

    expect(fetchMock.mock.calls[1][0]).toContain(
      "latitude=52.5&longitude=13.4",
    );
    expect(fetchMock.mock.calls[1].length).toBe(2);

    expect(fetchMock.mock.calls[0][1]).toEqual({ signal: undefined });
    expect(fetchMock.mock.calls[1][1]).toEqual({ signal: undefined });

    expect(data?.current?.city).toBe("Berlin");
  });

  it("should throw GEOCODING_FAILED when city is not found", async () => {
    const fetchMock = vi.mocked(global.fetch);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);

    await expect(fetchWeatherData(city)).rejects.toMatchObject({
      code: "GEOCODING_FAILED",
    });
  });

  it("should convert generic error into UNKNOWN_ERROR AppError", async () => {
    const fetchMock = vi.mocked(global.fetch);
    fetchMock.mockRejectedValue(new Error("Check your network connection..."));

    try {
      await fetchWeatherData(city);
      throw new Error("should throw");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);

      if (error instanceof AppError) {
        expect(error.code).toBe("UNKNOWN_ERROR");
        expect(error.message).toBe("Check your network connection...");
      }
    }
  });

  it("should handle abort signal", async () => {
    const fetchMock = vi.mocked(global.fetch);
    const abortController = new AbortController();

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => geoData,
    } as Response);

    fetchMock.mockImplementationOnce(() => {
      abortController.abort();
      return Promise.reject(new DOMException("Aborted", "AbortError"));
    });

    await expect(
      fetchWeatherData(city, abortController.signal),
    ).rejects.toThrow();
  });
});
