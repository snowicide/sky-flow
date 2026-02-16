import { DEFAULT_UNITS } from "@/components/Header/UnitsSettings";
import type { Units } from "@/stores/useSettingsStore";
import type {
  WeatherDataCurrent,
  WeatherDataHourly,
  WeatherDataDaily,
  WeatherDataUnits,
} from "@/types/api/WeatherData";
import type { WeatherResponse } from "@/types/api/WeatherResponse";
import { AppError } from "@/types/errors";

export async function fetchWeatherData(
  city: string,
  units: Units = DEFAULT_UNITS,
  signal?: AbortSignal,
): Promise<WeatherResponse> {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`;
    const geoRes = await fetch(geoUrl, { signal });

    if (!geoRes.ok) {
      signal?.throwIfAborted();
      throw new AppError(
        "GEOCODING_FAILED",
        `Check your network connection...`,
      );
    }

    const geoData = await geoRes.json();
    signal?.throwIfAborted();
    if (!geoData.results || geoData.results.length === 0)
      throw new AppError("GEOCODING_FAILED", `City ${city} not found...`);

    const { latitude, longitude, timezone, name, country } = geoData.results[0];
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
        temperature_unit: units.temp,
        wind_speed_unit: units.speed,
        precipitation_unit: units.precipitation,
      }).toString();

    const forecastRes = await fetch(forecastUrl, { signal });

    if (!forecastRes.ok) {
      signal?.throwIfAborted();
      throw new AppError(
        "FORECAST_FAILED",
        "Server is temporarily unavailable...",
      );
    }

    const forecastData = await forecastRes.json();
    const {
      apparent_temperature: temperature,
      wind_speed_10m,
      precipitation,
    } = forecastData.current_units;

    return {
      current: {
        ...forecastData.current,
        city: name,
        country,
      } as WeatherDataCurrent,
      hourly: forecastData.hourly as WeatherDataHourly,
      daily: forecastData.daily as WeatherDataDaily,
      forecastUnits: {
        temperature: temperature,
        speed: wind_speed_10m,
        precipitation,
      } as WeatherDataUnits,
    };
  } catch (error) {
    if (signal?.aborted) throw error;
    if (error instanceof AppError) throw error;
    const message =
      error instanceof Error ? error.message : "Unexpected error...";
    throw new AppError("UNKNOWN_ERROR", message);
  }
}
