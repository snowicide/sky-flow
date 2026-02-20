import type { SearchDataItem } from "@/types/api/SearchData";

export interface SearchResultCityProps {
  city: string;
  country: string;
  temperature: number;
  temperatureUnit: string;
  weatherCode: number;
  id: number;
  resultData: SearchDataItem[];
}
