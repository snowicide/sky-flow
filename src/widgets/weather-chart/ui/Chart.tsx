import { useState } from "react";

import type { WeatherDaily, WeatherHourly } from "@/entities/weather";

import { ChartTabs } from "./ChartTabs";
import { ChartView } from "./ChartView";

export interface ChartProps {
  dailyData: WeatherDaily;
  hourlyData: WeatherHourly;
}

export function Chart({ dailyData, hourlyData }: ChartProps) {
  const [currentChartTab, setCurrentChartTab] = useState("daily");

  return (
    <section className="relative flex flex-col gap-5 w-full max-w-100 sm:max-w-184 md:max-w-full xl:max-w-304 min-h-70 h-auto mx-auto bg-[hsl(243,27%,20%)] px-4 pb-4 pt-2 rounded-xl border border-white/10 items-center overflow-hidden">
      <ChartTabs
        tabData={TAB_DATA}
        currentChartTab={currentChartTab}
        setCurrentChartTab={setCurrentChartTab}
      />

      <div className="relative w-full min-h-50 chart-no-focus">
        <ChartView
          currentChartTab={currentChartTab}
          dailyData={dailyData}
          hourlyData={hourlyData}
        />
      </div>
    </section>
  );
}

const TAB_DATA = ["Daily", "Hourly"];
