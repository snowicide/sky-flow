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
    <li className="flex justify-between font-medium mx-2 px-3 py-3 my-3 text-white hover:bg-[hsl(243,23%,30%)] active:opacity-75 rounded-xl cursor-pointer">
      <div className="flex items-center gap-2">
        <Image src={icon} className="w-10 h-10" alt="" />
        <span>{`${city}, ${country}`}</span>
      </div>

      <div className="flex items-center gap-1 font-bold">
        <span className="text-lg">{temperature.toFixed(1)}</span>
        <span className="text-white/70 text-base">{temperatureUnit}</span>
      </div>
    </li>
  );
}
