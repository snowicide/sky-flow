import type { StaticImageData } from "next/image";
import { useCallback, useMemo } from "react";

import { useSearchActions } from "@/components/SearchSection/hooks/useSearchActions";
import type { SearchDataItem } from "@/components/SearchSection/types/SearchData";
import { isFoundCity } from "@/types/location";
import { getWeatherIcon } from "@/utils/weather";

export function useSearchResultCity(
  data: SearchDataItem,
): UseSearchResultCityReturn {
  const {
    weatherCode,
    city,
    country,
    temperature,
    temperatureUnit,
    latitude: lat,
    longitude: lon,
  } = data;
  const { searchSelectedCity } = useSearchActions();

  const icon = useMemo(() => getWeatherIcon(weatherCode), [weatherCode]);

  const handleClick = useCallback(() => {
    if (isFoundCity({ status: "found", city, country, lat, lon }))
      searchSelectedCity({ status: "found", city, country, lat, lon });
  }, [searchSelectedCity, city, country, lat, lon]);

  return useMemo(
    () => ({
      handleClick,
      icon,
      city,
      country,
      temperature,
      temperatureUnit,
    }),
    [handleClick, icon, city, country, temperature, temperatureUnit],
  );
}

interface UseSearchResultCityReturn {
  handleClick: () => void;
  icon: StaticImageData;
  city: string;
  country: string;
  temperature: number;
  temperatureUnit: string;
}
