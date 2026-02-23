export interface SearchGeoData {
  results: SearchGeoDataItem[];
}

export interface SearchGeoDataItem {
  latitude: number;
  longitude: number;
  timezone: string;
  name: string;
  country: string;
  id: number;
}
