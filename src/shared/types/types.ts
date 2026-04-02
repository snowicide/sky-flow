export interface GeoItem {
  city: string;
  lat: number;
  lon: number;
  id: number;
  region?: string | undefined;
  code?: string | undefined;
  country?: string | undefined;
  timezone?: string | undefined;
}

export interface Geo {
  results: GeoItem[];
}

export interface Units {
  temperatureUnit: "celsius" | "fahrenheit";
  speedUnit: "kmh" | "mph";
  precipitationUnit: "mm" | "inch";
  timeUnit: "12" | "24";
}
