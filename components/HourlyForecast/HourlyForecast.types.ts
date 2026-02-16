import type {
  WeatherDataHourly,
  WeatherDataUnits,
} from "@/types/api/WeatherData";

export interface HourlyForecastProps {
  hourlyData: WeatherDataHourly;
  forecastUnits: WeatherDataUnits;
}
