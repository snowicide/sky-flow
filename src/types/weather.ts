import type { StaticImageData } from "next/image";

export interface Units {
  temperature: "celsius" | "fahrenheit";
  speed: "kmh" | "mph";
  precipitation: "mm" | "inch";
  time: "12" | "24";
}

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
