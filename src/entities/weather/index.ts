// --- api ---
export { useWeatherQuery } from "./api/useWeatherQuery";
export { fetchSearchResults } from "./api/weather.api";
export { useSearchQuery } from "./api/useSearchQuery";

// --- lib ---
export { getWeatherIcon } from "./model/icons";
export { calculateAverageTemps, groupByDay } from "./model/weather.utils";

// --- model ---
export type { HourlyItem, DailyForecast, format } from "./model/types";
export type { SearchResult, SearchResults } from "./model/search-results.types";
export type {
  WeatherDaily,
  WeatherHourly,
  WeatherCurrent,
  Weather,
  WeatherUnits,
} from "./model/weather.types";
