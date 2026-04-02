import { useCallback, useMemo } from "react";
import { formatCityDisplay } from "@/entities/location";
import { SearchResult } from "@/entities/weather";
import { isFoundCity } from "@/shared/types";
import { useSearchActions } from "../model/useSearchActions";

export function useSearchResultCity(
  data: SearchResult,
  inputRef: React.RefObject<HTMLInputElement | null>,
): UseSearchResultCityReturn {
  const {
    city,
    country,
    temperature,
    temperatureUnit,
    lat,
    lon,
    code,
    weatherCode,
    region,
  } = data;
  const { searchSelectedCity } = useSearchActions();

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
      weatherCode,
      city,
      country,
      temperature,
      temperatureUnit,
      displayName,
    }),
    [
      handleClick,
      city,
      country,
      temperature,
      temperatureUnit,
      displayName,
      weatherCode,
    ],
  );
}

interface UseSearchResultCityReturn {
  handleClick: () => void;
  city: string;
  country?: string;
  temperature: number;
  temperatureUnit: string;
  displayName: string;
  weatherCode: number;
}
