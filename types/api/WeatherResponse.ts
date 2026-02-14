import {
  WeatherDataCurrent,
  WeatherDataHourly,
  WeatherDataDaily,
} from "@/types/api/WeatherData";

export type WeatherError = {
  code: "GEOCODING_FAILED" | "FORECAST_FAILED" | "UNKNOWN_ERROR";
  message: string;
  details?: unknown;
};
export type WeatherResponse = {
  current: WeatherDataCurrent;
  hourly: WeatherDataHourly;
  daily: WeatherDataDaily;
};
