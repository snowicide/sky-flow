export interface UseWeatherChartLogicReturn {
  hourUnit: "12" | "24";
  currentUnit: "°C" | "°F";
  chartDailyData: {
    day: string;
    temp: number;
  }[];
  chartHourlyData: {
    hour: string;
    temp: number;
  }[];
  dailyTicks: number[];
  hourlyTicks: number[];
}
