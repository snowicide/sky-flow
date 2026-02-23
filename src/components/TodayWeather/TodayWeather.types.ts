import type {
  WeatherDataCurrent,
  WeatherDataUnits,
} from "@/types/api/WeatherData";

export interface TodayWeatherProps {
  currentData: WeatherDataCurrent;
  forecastUnits: WeatherDataUnits;
}
