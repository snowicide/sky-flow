import { DailyChartData, HourlyChartData } from "../../../../types/types";

export const createChartData = (): ChartFactories => ({
  dailyChartData: getDailyChartData(),
  hourlyChartData: getHourlyChartData(),
});

const getDailyChartData = (): DailyChartData => [
  ...Array(6).fill({
    day: "Saturday",
    temp: 0,
  }),
  {
    day: "Sunday",
    temp: 1,
  },
];

const getHourlyChartData = (): HourlyChartData => [
  ...Array(23).fill({
    hour: "1 PM",
    temp: 0,
  }),
  {
    hour: "2 PM",
    temp: 1,
  },
];

type ChartFactories = {
  dailyChartData: DailyChartData;
  hourlyChartData: HourlyChartData;
};
