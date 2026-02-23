export interface ForecastResponse {
  current: {
    interval: number;
    temperature_2m: number;
    time: string;
    weather_code: number;
  };
  current_units: {
    interval: string;
    temperature_2m: string;
    time: string;
  };
  elevation: number;
  generationtime_ms: number;
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}
