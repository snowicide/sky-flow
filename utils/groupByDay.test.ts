import groupByDay from "./groupByDay";
import fogIcon from "@/public/icons/icon-fog.webp";
import sunnyIcon from "@/public/icons/icon-sunny.webp";

describe("groupByDay", () => {
  it("should sort days and hours", () => {
    const mockWeatherDataHourly = {
      temperature_2m: [-2, -3],
      time: ["2026-02-21T23:00", "2026-02-21T22:00"],
      weather_code: [45, 0],
    };

    const days = groupByDay(mockWeatherDataHourly);

    expect(days).toHaveLength(1);
    expect(days[0].date).toBe("2026-02-21");

    expect(days[0].hours[0]).toEqual({
      hour: "10 PM",
      image: sunnyIcon,
      temp: -3,
      weatherCode: 0,
    });

    expect(days[0].hours[1].hour).toBe("11 PM");
    expect(days[0].hours[1].image).toBe(fogIcon);
  });
});
