import { useMemo } from "react";

import { useSettingsStore } from "@/stores/useSettingsStore";
import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";

import { getTicks } from "../chart-utils";

import { useChartData } from "./useChartData";
import { useResponsiveHourlyData } from "./useResponsiveHourlyData";
import type { UseWeatherChartLogicReturn } from "./useWeatherChartLogic.types";

export function useWeatherChartLogic(
  dailyData: WeatherDataDaily,
  hourlyData: WeatherDataHourly,
): UseWeatherChartLogicReturn {
  const { getChartDailyData, getChartHourlyData } = useChartData();
  const tempUnit = useSettingsStore((state) => state.units.temperature);
  const hourUnit = useSettingsStore((state) => state.units.time);
  const currentUnit = useMemo(
    () => (tempUnit === "celsius" ? "°C" : "°F"),
    [tempUnit],
  );

  const chartDailyData = useMemo(
    () => getChartDailyData(dailyData),
    [dailyData, getChartDailyData],
  );
  const fullHourlyData = useMemo(
    () => getChartHourlyData(hourlyData),
    [getChartHourlyData, hourlyData],
  );
  const chartHourlyData = useResponsiveHourlyData(fullHourlyData);

  const dailyTicks = useMemo(() => getTicks(chartDailyData), [chartDailyData]);
  const hourlyTicks = useMemo(
    () => getTicks(chartHourlyData),
    [chartHourlyData],
  );

  return {
    hourUnit,
    currentUnit,
    chartDailyData,
    chartHourlyData,
    dailyTicks,
    hourlyTicks,
  };
}
