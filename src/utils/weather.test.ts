
import fogIcon from "@/../public/icons/icon-fog.webp";
import overcastIcon from "@/../public/icons/icon-overcast.webp";
import sunnyIcon from "@/../public/icons/icon-sunny.webp";

import { groupByDay } from "./weather";
import { GET_ICON_BY_WEATHER_CODE, getWeatherCode } from "./weather";

describe("weather", () => {
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

  describe("getIconByWeatherCode", () => {
    it("should get code", () => {
      const sunnyCode = 1;
      const overcastCode = 3;
      const fogCode = 45;

      const getSunny = getWeatherCode(sunnyCode);
      const getOvercast = getWeatherCode(overcastCode);
      const getFog = getWeatherCode(fogCode);
      expect(getSunny).toBe("sunny");
      expect(getOvercast).toBe("overcast");
      expect(getFog).toBe("fog");

      const getSunnySrc = GET_ICON_BY_WEATHER_CODE[getSunny];
      const getOvercastSrc = GET_ICON_BY_WEATHER_CODE[getOvercast];
      const getFogSrc = GET_ICON_BY_WEATHER_CODE[getFog];
      expect(getSunnySrc).toBe(sunnyIcon);
      expect(getOvercastSrc).toBe(overcastIcon);
      expect(getFogSrc).toBe(fogIcon);
    });
  });
});
