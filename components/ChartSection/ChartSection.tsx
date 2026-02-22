import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";
import { useState } from "react";
import { WeatherChart } from "./WeatherChart";

export interface ChartSectionProps {
  dailyData: WeatherDataDaily;
  hourlyData: WeatherDataHourly;
}

export function ChartSection({ dailyData, hourlyData }: ChartSectionProps) {
  const [currentTab, setCurrentTab] = useState<"daily" | "hourly">("daily");

  return (
    <section className="flex flex-col gap-5 w-full h-150 xl:max-w-304 mx-auto bg-[hsl(243,27%,20%)]  p-4 rounded-xl border border-white/10 items-center">
      {/* daily/hourly tabs */}
      <ul
        role="tablist"
        className="flex justify-between w-full items-center mt-5"
      >
        <li
          role="tab"
          aria-selected={currentTab === "daily"}
          aria-label="Daily chart"
          onClick={() => setCurrentTab("daily")}
          className={`flex-1 gap-1.5 transition relative cursor-pointer hover:opacity-80 flex items-center h-full justify-center mx-auto text-xl font-bold tracking-wider rounded-xl`}
        >
          <span
            className={`
              text-sm sm:text-lg lg:text-xl whitespace-nowrap border-b-2 pb-3 px-10
               ${
                 currentTab === "daily"
                   ? "text-[hsl(233,100%,70%)] border-b-2 border-[hsl(233,100%,70%)]"
                   : "text-white border-white/70"
               }
            `}
          >
            Daily
          </span>
        </li>
        <li
          role="tab"
          aria-selected={currentTab === "hourly"}
          aria-label="Hourly chart"
          onClick={() => setCurrentTab("hourly")}
          className={`flex-1 gap-1.5 transition relative cursor-pointer hover:opacity-80 flex items-center h-full justify-center mx-auto text-xl font-bold tracking-wider rounded-xl`}
        >
          <span
            className={`
              text-sm sm:text-lg lg:text-xl whitespace-nowrap border-b-2 pb-3 px-10
               ${
                 currentTab === "hourly"
                   ? "text-[hsl(233,100%,70%)] border-b-2 border-[hsl(233,100%,70%)]"
                   : "text-white border-white/70"
               }
            `}
          >
            Hourly
          </span>
        </li>
      </ul>

      {/* chart */}
      <WeatherChart
        currentTab={currentTab}
        dailyData={dailyData}
        hourlyData={hourlyData}
      />
    </section>
  );
}
