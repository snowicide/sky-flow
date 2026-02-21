import sunnyIcon from "@/public/icons/icon-sunny.webp";
import partlyCloudyIcon from "@/public/icons/icon-partly-cloudy.webp";
import snowIcon from "@/public/icons/icon-snow.webp";
import fogIcon from "@/public/icons/icon-fog.webp";
import rainIcon from "@/public/icons/icon-rain.webp";
import drizzleIcon from "@/public/icons/icon-drizzle.webp";
import stormIcon from "@/public/icons/icon-storm.webp";
import overcastIcon from "@/public/icons/icon-overcast.webp";
import { StaticImageData } from "next/image";

export const getIconByWeatherCode: Record<string, StaticImageData> = {
  sunny: sunnyIcon,
  partlyCloudy: partlyCloudyIcon,
  overcast: overcastIcon,
  fog: fogIcon,
  drizzle: drizzleIcon,
  rain: rainIcon,
  snow: snowIcon,
  storm: stormIcon,
};

export function getWeatherCode(code: number) {
  const weatherCodeToIcon: Record<number, string> = {
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
  return weatherCodeToIcon[code];
}
