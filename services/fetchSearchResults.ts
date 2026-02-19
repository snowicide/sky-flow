import { DEFAULT_UNITS } from "@/components/Header/UnitsSettings";
import type { ForecastResponse } from "@/types/api/ForecastResponse";
import type { SearchDataItem } from "@/types/api/SearchData";
import type { SearchGeoData } from "@/types/api/SearchGeoData";
import type { WeatherDataUnits } from "@/types/api/WeatherData";
import { AppError } from "@/types/errors";

export async function fetchSearchResults(
  searchResult: string,
  units: WeatherDataUnits = DEFAULT_UNITS,
): Promise<SearchDataItem[]> {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchResult)}&count=8&language=en`;
    const geoRes = await fetch(geoUrl);

    if (!geoRes.ok) {
      throw new AppError(
        "GEOCODING_FAILED",
        "Check your network connection...",
      );
    }

    const geoData: SearchGeoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new AppError(
        "GEOCODING_FAILED",
        `City ${searchResult} not found...`,
      );
    }

    const onlyLatitude = geoData.results.map((item) => item.latitude);
    const onlyLongitude = geoData.results.map((item) => item.longitude);
    const onlyTimezone = geoData.results.map((item) => item.timezone);

    const forecastUrl =
      `https://api.open-meteo.com/v1/forecast?` +
      new URLSearchParams({
        latitude: onlyLatitude.join(",").toString(),
        longitude: onlyLongitude.join(",").toString(),

        current: "temperature_2m,weather_code",

        timezone: onlyTimezone.join(",").toString(),
        temperature_unit: units.temperature,
        wind_speed_unit: units.speed,
        precipitation_unit: units.precipitation,
      }).toString();

    const forecastRes = await fetch(forecastUrl);

    if (!forecastRes.ok) {
      throw new AppError(
        "FORECAST_FAILED",
        "Server is temporarily unavailable...",
      );
    }

    const forecastData: ForecastResponse[] = await forecastRes.json();

    const filteredData = forecastData.map((item) => {
      return {
        temperature: item.current.temperature_2m,
        temperatureUnit: item.current_units.temperature_2m,
        weatherCode: item.current.weather_code,
      };
    });

    const data = geoData.results.map((item, index) => {
      return {
        ...filteredData[index],
        city: item.name,
        country: item.country,
        id: item.id,
      };
    });

    return data;
  } catch (error) {
    if (error instanceof AppError) throw Error;
    const message =
      error instanceof Error ? error.message : "Unexpected error...";
    throw new AppError("UNKNOWN_ERROR", message);
  }
}
