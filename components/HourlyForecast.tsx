"use client";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import HourlyForecastSkeleton from "./skeletons/HourlyForecast.skeleton";
import ChangeSelectedDay from "./ui/ChangeSelectedDay";
import groupByDay from "@/utils/groupByDay";
import { useSearchParams } from "next/navigation";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";

export default function HourlyForecast() {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const hoursRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "Minsk";
  const { data: result, isPending, isError } = useWeatherQuery(city);

  const days = useMemo(() => {
    if (!result?.success) return [];
    return groupByDay(result.data.hourly).slice(1);
  }, [result]);

  if (isPending || isError || !result?.success) {
    return <HourlyForecastSkeleton />;
  }

  const selectedDay = days[selectedDayIndex] || {
    date: "",
    dayName: "",
    hours: [],
  };
  const hours = selectedDay.hours;

  const handleChangeDay = (index: number) => {
    setSelectedDayIndex(index);
    hoursRef.current?.scrollTo({ top: 0 });
  };

  return (
    <div className="lg:w-96 w-full max-h-full md:max-w-full">
      <div className="bg-[hsl(243,27%,20%)] max-h-full p-5 sm:p-6 rounded-2xl border border-white/10 sticky top-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Hourly forecast</h3>
          <ChangeSelectedDay
            days={days}
            setSelectedDayIndex={handleChangeDay}
          />
        </div>

        <div
          className="space-y-2.5 overflow-auto max-h-136 scrollbar-hide"
          ref={hoursRef}
        >
          {hours.map(({ hour, image, temp }, index) => (
            <div
              key={`${hour}-${index}`}
              className="flex items-center justify-between bg-[hsl(243,23%,24%)] hover:opacity-75 p-3 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <Image
                    src={image}
                    alt={`${hour} weather`}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium">{hour}</span>
              </div>
              <span className="text-xl font-bold">{temp.toFixed(1)}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
