import { StaticImageData } from "next/image";

import drizzleIcon from "../assets/icon-drizzle.webp";
import fogIcon from "../assets/icon-fog.webp";
import overcastIcon from "../assets/icon-overcast.webp";
import partlyCloudyIcon from "../assets/icon-partly-cloudy.webp";
import rainIcon from "../assets/icon-rain.webp";
import snowIcon from "../assets/icon-snow.webp";
import stormIcon from "../assets/icon-storm.webp";
import sunnyIcon from "../assets/icon-sunny.webp";

const WEATHER_CODE_TO_ICON: Record<number, string> = {
  0: "sunny",
  1: "sunny",
  2: "partlyCloudy",
  3: "overcast",
  45: "fog",
  48: "fog",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  56: "drizzle",
  57: "drizzle",
  61: "rain",
  63: "rain",
  65: "rain",
  66: "rain",
  67: "rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "rain",
  81: "rain",
  82: "rain",
  85: "snow",
  86: "snow",
  95: "storm",
  96: "storm",
  99: "storm",
};

const GET_ICON_BY_WEATHER_CODE: Record<string, StaticImageData> = {
  sunny: sunnyIcon,
  partlyCloudy: partlyCloudyIcon,
  overcast: overcastIcon,
  fog: fogIcon,
  drizzle: drizzleIcon,
  rain: rainIcon,
  snow: snowIcon,
  storm: stormIcon,
};

export function getWeatherIcon(code: number): StaticImageData {
  const currentCode = WEATHER_CODE_TO_ICON[code] ?? "sunny";
  return GET_ICON_BY_WEATHER_CODE[currentCode];
}
