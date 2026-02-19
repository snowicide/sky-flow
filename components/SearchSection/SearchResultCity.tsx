import { getWeatherCode } from "@/utils/weatherCodes";
import type { SearchResultCityProps } from "./SearchResultCity.props";
import { getIconByWeatherCode } from "@/utils/getIconByWeatherCode";
import Image from "next/image";

export function SearchResultCity({
  city,
  country,
  temperature,
  temperatureUnit,
  weatherCode,
}: SearchResultCityProps) {
  const code = getWeatherCode(weatherCode);
  const icon = getIconByWeatherCode[code];

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center">
        <Image src={icon} className="w-8 h-8" alt="" />
        <span>{`${city}, ${country}`}</span>
      </div>

      <div className="flex items-center">
        <span>{temperature}</span>
        <span className="text-white/70">{temperatureUnit}</span>
      </div>
    </li>
  );
}
