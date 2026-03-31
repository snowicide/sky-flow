// --- api ---
export { useWeatherQuery } from "./api/useWeatherQuery";
export { fetchSearchResults } from "./api/weather.api";

// --- lib ---
export { getWeatherIcon } from "./lib/icons";
export { calculateAverageTemps, groupByDay } from "./lib/weather.utils";

// --- model ---
export type { Units, HourlyItem, DailyForecast, format } from "./model/types";
export type { SearchResult, SearchResults } from "./model/search-results.types";
export type {
  WeatherDaily,
  WeatherHourly,
  WeatherCurrent,
  Weather,
  WeatherUnits,
} from "./model/weather.types";
