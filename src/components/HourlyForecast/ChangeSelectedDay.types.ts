import type { DailyForecast } from "@/types/api/WeatherHourly";

export interface ChangeSelectedDayProps {
  days: DailyForecast[];
  setSelectedDayIndex: (index: number) => void;
}
