export const API_CONFIG: Record<string, string> = {
  GEO_BASE_URL: "https://geocoding-api.open-meteo.com",
  FORECAST_BASE_URL: "https://api.open-meteo.com",
} as const;

export const STORAGE_KEYS = {
  RECENT: "weather-recent",
  FAVORITES: "weather-favorites",
  SEARCH: "weather-search",
  SETTINGS: "weather-settings",
} as const;
