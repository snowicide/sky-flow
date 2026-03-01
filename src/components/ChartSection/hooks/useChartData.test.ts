import { act, renderHook } from "@testing-library/react";

import { useSettingsStore } from "@/stores/useSettingsStore";
import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";

import { useChartData } from "./useChartData";

describe("useChartData", () => {
  const mockDailyData = {
    temperature_2m_min: [-2, -4],
    temperature_2m_max: [-4, -8],
    weather_code: [0, 1],
    time: ["2026-02-28", "2026-03-01"],
  } as WeatherDataDaily;

  const mockHourlyData = {
    temperature_2m: [0, -2, -8],
    time: ["2026-02-28T00:00", "2026-02-28T14:00", "2026-03-01T15:00"],
    weather_code: [0, 0, 1],
  } as WeatherDataHourly;

  beforeEach(() => {
    useSettingsStore.getState().reset();
  });

  it("should return formatted DailyData", () => {
    const { result } = renderHook(() =>
      useChartData(mockDailyData, mockHourlyData),
    );

    expect(result.current.chartDailyData[0]).toEqual({
      day: "Saturday",
      temp: -3,
    });
  });

  it("should return formatted HourlyData", () => {
    const { result } = renderHook(() =>
      useChartData(mockDailyData, mockHourlyData),
    );

    expect(result.current.chartHourlyData).toEqual([
      { hour: "2 PM", temp: -2 },
    ]);
  });

  it("should change selected day index", () => {
    const { result, rerender } = renderHook(() =>
      useChartData(mockDailyData, mockHourlyData),
    );

    expect(result.current.chartHourlyData[0].hour).toBe("2 PM");
    expect(result.current.chartHourlyData[0].temp).toBe(-2);

    act(() => useSettingsStore.setState({ selectedDayIndex: 1 }));
    rerender();

    expect(result.current.chartHourlyData[0].hour).toBe("3 PM");
    expect(result.current.chartHourlyData[0].temp).toBe(-8);
  });

  it("should return correct hour format", () => {
    act(() =>
      useSettingsStore.setState({
        units: { ...useSettingsStore.getState().units, time: "24" },
        selectedDayIndex: 0,
      }),
    );

    const { result } = renderHook(() =>
      useChartData(mockDailyData, mockHourlyData),
    );

    expect(result.current.chartHourlyData[0].hour).toBe("14:00");
  });
});
