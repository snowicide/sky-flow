import { getIconByWeatherCode, getWeatherCode } from "./getIconByWeatherCode";
import sunnyIcon from "@/public/icons/icon-sunny.webp";
import fogIcon from "@/public/icons/icon-fog.webp";
import overcastIcon from "@/public/icons/icon-overcast.webp";

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

    const getSunnySrc = getIconByWeatherCode[getSunny];
    const getOvercastSrc = getIconByWeatherCode[getOvercast];
    const getFogSrc = getIconByWeatherCode[getFog];
    expect(getSunnySrc).toBe(sunnyIcon);
    expect(getOvercastSrc).toBe(overcastIcon);
    expect(getFogSrc).toBe(fogIcon);
  });
});
