import fogIcon from "../../assets/icon-fog.webp";
import overcastIcon from "../../assets/icon-overcast.webp";
import sunnyIcon from "../../assets/icon-sunny.webp";
import { getWeatherIcon } from "../icons";

describe("getIconByWeatherCode", () => {
  test.each([
    { code: 1, expected: sunnyIcon },
    { code: 3, expected: overcastIcon },
    { code: 45, expected: fogIcon },
  ])("it should get expected code", ({ code, expected }) => {
    const getSrc = getWeatherIcon(code);
    expect(getSrc).toBe(expected);
  });
});
