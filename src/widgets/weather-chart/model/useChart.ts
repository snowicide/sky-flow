import { useMemo, useState } from "react";
import { type WeatherDaily, type WeatherHourly } from "@/entities/weather";
import { useDeviceType } from "@/shared/lib";
import { useChartData } from "./useChartData";
import { useChartFormat } from "./useChartFormat";
import { useChartResize } from "./useChartResize";
import { useResponsiveHourlyData } from "./useResponsiveHourlyData";

export function useChart(
  dailyData: WeatherDaily | undefined,
  hourlyData: WeatherHourly | undefined,
): ChartReturn {
  const { isMobile, isTablet, isDesk, isSmallDesk } = useDeviceType();
  const [currentChartTab, setCurrentChartTab] = useState("daily");
  const { chartDailyData, chartHourlyData: fullHourlyData } = useChartData(
    dailyData,
    hourlyData,
  );
  const chartHourlyData = useResponsiveHourlyData(fullHourlyData);
  const isResizing = useChartResize();
  const isDailyTab = currentChartTab === "daily";

  const activeData = useMemo(
    () => (isDailyTab ? chartDailyData : chartHourlyData),
    [isDailyTab, chartDailyData, chartHourlyData],
  );

  const formatters = useChartFormat(
    isDailyTab ? chartDailyData : fullHourlyData,
    isDailyTab,
    currentChartTab,
    {
      isMobile,
      isTablet,
      isDesk,
      isSmallDesk,
    },
  );

  return useMemo(
    () => ({
      currentChartTab,
      activeData,
      isDailyTab,
      isResizing,
      setCurrentChartTab,
      formatters,
      currentDevice: {
        isMobile,
        isTablet,
        isDesk,
        isSmallDesk,
      },
    }),
    [
      currentChartTab,
      activeData,
      isDailyTab,
      isResizing,
      setCurrentChartTab,
      formatters,
      isMobile,
      isTablet,
      isDesk,
      isSmallDesk,
    ],
  );
}

interface ChartReturn {
  currentChartTab: string;
  activeData:
    | {
        hour: string;
        temp: number;
      }[]
    | {
        day: string;
        temp: number;
      }[];
  isDailyTab: boolean;
  isResizing: boolean;
  setCurrentChartTab: React.Dispatch<React.SetStateAction<string>>;
  formatters: {
    handleXAxisTickFormat: (value: string) => string;
    yTicks: number[];
    yDomain: number[];
    currentUnit: string;
    dataKey: string;
    aspect: number;
  };
  currentDevice: {
    isMobile: boolean;
    isTablet: boolean;
    isDesk: boolean;
    isSmallDesk: boolean;
  };
}
