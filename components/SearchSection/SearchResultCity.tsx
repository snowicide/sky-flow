import type { SearchResultCityProps } from "./SearchResultCity.props";
import {
  getIconByWeatherCode,
  getWeatherCode,
} from "@/utils/getIconByWeatherCode";
import Image from "next/image";
import { useSearchActions } from "@/hooks/useSearchActions";

export function SearchResultCity({
  city,
  country,
  temperature,
  temperatureUnit,
  weatherCode,
  id,
  resultData,
}: SearchResultCityProps) {
  const { searchSelectedCity } = useSearchActions();

  const code = getWeatherCode(weatherCode);
  const icon = getIconByWeatherCode[code];
  const currentCity =
    resultData.find((item) => item.id === id) || resultData[0];

  const handleClick = () => {
    const cityData = {
      lat: currentCity.latitude,
      lon: currentCity.longitude,
      city: currentCity.city,
      country: currentCity.country,
    };
    searchSelectedCity(cityData);
  };

  return (
    <li
      onClick={handleClick}
      className="flex justify-between font-medium mx-1 sm:mx-2 px-2 sm:px-3 py-2 my-2 xl:mx-2 xl:px-3 xl:py-3 xl:my-3 text-white hover:bg-[hsl(243,23%,30%)] active:opacity-75 rounded-xl cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <Image src={icon} className="w-8 h-8 lg:w-10 lg:h-10" alt="" />
        <span className="text-sm sm:text-base">{`${city}, ${country}`}</span>
      </div>

      <div className="flex items-center gap-1 font-bold">
        <span className="text-base md:text-lg">{temperature.toFixed(1)}</span>
        <span className="text-white/70 text-sm md:text-base">
          {temperatureUnit}
        </span>
      </div>
    </li>
  );
}
