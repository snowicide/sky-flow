"use client";
import { usePathname, useRouter } from "next/navigation";
import { RefObject, useCallback, useMemo } from "react";

import { CityData, isFoundCity } from "@/entities/location";
import { fetchGeoData, useSearchHistory } from "@/entities/location";
import { useSearchState } from "@/entities/location/model/useSearchStore";

import { mapCityToUrlParams } from "./mapCityToUrlParams";

export function useSearchActions(): UseSearchActionsReturn {
  const { setInputValue, setIsOpen, inputValue } = useSearchState();

  const { addCity } = useSearchHistory();
  const router = useRouter();
  const pathname = usePathname();

  const searchSelectedCity = useCallback(
    (
      cityData: CityData,
      inputRef?: RefObject<HTMLInputElement | null>,
    ): void => {
      inputRef?.current?.blur();
      setIsOpen(false);
      setInputValue("");

      const params = mapCityToUrlParams(cityData);
      if (isFoundCity(cityData)) addCity(cityData);

      router.push(`${pathname}?${params.toString()}`);
    },
    [addCity, pathname, router, setInputValue, setIsOpen],
  );

  const searchCityWithName = useCallback(
    async (city: string): Promise<void> => {
      const targetCity = city.trim().toLowerCase();
      if (!targetCity) return;
      const geoData = await fetchGeoData(targetCity);

      if (!geoData || geoData.results.length === 0) {
        searchSelectedCity({ status: "not-found", city: inputValue });
        return;
      }

      searchSelectedCity({
        status: "found",
        city: geoData.results[0].name,
        country: geoData.results?.[0]?.country,
        region: geoData.results?.[0]?.admin1,
        code: geoData.results?.[0]?.feature_code,
        lat: geoData.results[0].latitude,
        lon: geoData.results[0].longitude,
      });
    },
    [searchSelectedCity, inputValue],
  );

  return useMemo(
    () => ({
      searchSelectedCity,
      searchCityWithName,
    }),
    [searchSelectedCity, searchCityWithName],
  );
}

interface UseSearchActionsReturn {
  searchSelectedCity: (
    cityData: CityData,
    inputRef?: RefObject<HTMLInputElement | null>,
  ) => void;
  searchCityWithName: (city: string) => Promise<void>;
}
