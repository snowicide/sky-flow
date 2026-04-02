import type { StaticImageData } from "next/image";
import { useCallback, useMemo } from "react";
import { formatCityDisplay } from "@/entities/location";
import { getWeatherIcon, SearchResult } from "@/entities/weather";
import { isFoundCity } from "@/shared/types";
import { useSearchActions } from "../model/useSearchActions";

export function useSearchResultCity(
  data: SearchResult,
  inputRef: React.RefObject<HTMLInputElement | null>,
): UseSearchResultCityReturn {
  const {
    weatherCode,
    city,
    country,
    temperature,
    temperatureUnit,
    lat,
    lon,
    code,
    region,
  } = data;
  const { searchSelectedCity } = useSearchActions();

  const icon = useMemo(() => getWeatherIcon(weatherCode), [weatherCode]);
  const cityData = useMemo(
    () => ({
      status: "found" as const,
      city,
      country,
      lat,
      lon,
      code,
      region,
    }),
    [city, country, lat, lon, code, region],
  );

  const displayName = useMemo(() => formatCityDisplay(cityData), [cityData]);

  const handleClick = useCallback(() => {
    if (isFoundCity(cityData)) searchSelectedCity(cityData, inputRef);
  }, [searchSelectedCity, cityData, inputRef]);

  return useMemo(
    () => ({
      handleClick,
      icon,
      city,
      country,
      temperature,
      temperatureUnit,
      displayName,
    }),
    [
      handleClick,
      icon,
      city,
      country,
      temperature,
      temperatureUnit,
      displayName,
    ],
  );
}

interface UseSearchResultCityReturn {
  handleClick: () => void;
  icon: StaticImageData;
  city: string;
  country?: string;
  temperature: number;
  temperatureUnit: string;
  displayName: string;
}
