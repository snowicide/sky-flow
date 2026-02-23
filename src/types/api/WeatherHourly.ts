import { StaticImageData } from "next/image";

export interface WeatherHourly {
  data: {
    temperature_2m: number[];
    time: string[];
    weather_code: number[];
  };
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
