export interface SearchGeoData {
  results: SearchGeoDataItem[];
}

export interface SearchGeoDataItem {
  latitude: string;
  longitude: string;
  timezone: string;
  name: string;
  country: string;
  id: number;
}
