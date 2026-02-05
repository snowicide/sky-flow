import type {
  WeatherDataCurrent,
  WeatherDataHourly,
  WeatherDataDaily,
} from "@/types/WeatherData";
import type { WeatherResponse } from "@/types/WeatherResponse";

export async function fetchWeatherData(
  city: string,
  signal?: AbortSignal,
): Promise<WeatherResponse> {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`;
    const geoRes = await fetch(geoUrl, { signal });

    if (!geoRes.ok) {
      signal?.throwIfAborted();
      throw new Error("GEOCODING_FAILED");
    }

    const geoData = await geoRes.json();

    signal?.throwIfAborted();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("GEOCODING_FAILED");
    }

    const { latitude, longitude, timezone } = geoData.results[0];
    const forecastUrl =
      `https://api.open-meteo.com/v1/forecast?` +
      new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),

        current:
          "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code",

        hourly: "temperature_2m,weather_code",
        daily:
          "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min",

        timezone,
        forecast_days: "7",
        temperature_unit: "celsius",
        wind_speed_unit: "kmh",
        precipitation_unit: "mm",
      }).toString();

    const forecastRes = await fetch(forecastUrl, { signal });

    if (!forecastRes.ok) {
      signal?.throwIfAborted();
      throw new Error("FORECAST_FAILED");
    }

    const forecastData = await forecastRes.json();

    return {
      success: true,
      data: {
        current: {
          ...forecastData.current,
          city: geoData.results[0].name,
          country: geoData.results[0].country,
        } as WeatherDataCurrent,
        hourly: forecastData.hourly as WeatherDataHourly,
        daily: forecastData.daily as WeatherDataDaily,
      },
      validatedCity: geoData.results[0].name,
    };
  } catch (error) {
    if (signal?.aborted) throw error;

    console.error("Unknown error: ", error);

    throw error instanceof Error ? error : new Error("UNKNOWN_ERROR");
  }
}
