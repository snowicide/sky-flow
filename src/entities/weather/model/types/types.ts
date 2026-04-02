import type { StaticImageData } from "next/image";

export interface HourlyItem {
  hour: string;
  temp: number;
  weatherCode: number;
  image: StaticImageData;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  hours: HourlyItem[];
}

export interface format {
  hourFormat: "12" | "24";
  dayFormat: "dd" | "ddd" | "dddd";
}
