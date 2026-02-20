import { DEFAULT_UNITS } from "@/components/Header/UnitsSettings";
import type { WeatherDataUnits } from "@/types/api/WeatherData";
import type { WeatherResponse } from "@/types/api/WeatherResponse";
import { AppError } from "@/types/errors";
import { fetchGeoData } from "./fetchGeoData";

export async function fetchWeatherData(
  city: string,
  units: WeatherDataUnits = DEFAULT_UNITS,
  signal?: AbortSignal,
): Promise<WeatherResponse> {
  try {
    const geoData = await fetchGeoData(city);

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
        temperature_unit: units.temperature,
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
        latitude,
        longitude,
      },
      hourly: forecastData.hourly,
      daily: forecastData.daily,
      forecastUnits: {
        temperature: temperature,
        speed: wind_speed_10m,
        precipitation,
      },
    };
  } catch (error) {
    if (signal?.aborted) throw error;
    if (error instanceof AppError) throw error;
    const message =
      error instanceof Error ? error.message : "Unexpected error...";
    throw new AppError("UNKNOWN_ERROR", message);
  }
}
