import type {
  WeatherDataCurrent,
  WeatherDataUnits,
} from "@/types/api/WeatherData";

export interface WeatherDetailsProps {
  currentData: WeatherDataCurrent;
  forecastUnits: WeatherDataUnits;
}
