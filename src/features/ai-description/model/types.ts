export type RequestData = {
  city: string;
  country?: string;
  region?: string;
  lat: number;
  lon: number;
  temperature?: number;
  condition?: string;
};

export type ServerRequestData = {
  option: "location" | "weather";
  city: string;
  lat: number;
  lon: number;
  country?: string | null | undefined;
  region?: string | null | undefined;
  temperature?: number | undefined;
  condition?: string | undefined;
};
