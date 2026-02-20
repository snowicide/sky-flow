import { useSearchStore } from "@/stores/useSearchStore";
import { useShallow } from "zustand/shallow";
import type { ActiveTab } from "@/components/SearchSection/SearchField.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useSearchQuery } from "./useSearchQuery";
import { fetchGeoData } from "@/services/fetchGeoData";
import { useSearchHistory } from "./useSearchHistory";

export function useSearchActions() {
  const { setInputValue, setCurrentTab, inputValue, setIsOpen } =
    useSearchStore(
      useShallow((state) => ({
        setInputValue: state.setInputValue,
        setCurrentTab: state.setCurrentTab,
        inputValue: state.inputValue,
        setIsOpen: state.setIsOpen,
      })),
    );

  const [delayValue] = useDebounce(inputValue, 1000);
  const { data: resultData, isPending: isResultPending } =
    useSearchQuery(delayValue);

  const { addCity } = useSearchHistory();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChangeTab = (value: ActiveTab) => {
    setCurrentTab(value);
  };

  const searchSelectedCity = (
    cityData: {
      city: string;
      country: string;
      lat: number;
      lon: number;
    },
    inputRef?: React.RefObject<HTMLInputElement | null>,
  ) => {
    inputRef?.current?.blur();
    setIsOpen(false);
    setInputValue("");

    if (cityData) {
      const { lat, lon, city, country } = cityData;
      addCity(
        city.toLowerCase(),
        country.toLowerCase(),
        Number(lat),
        Number(lon),
      );
    }

    const latStr = cityData.lat.toString();
    const lonStr = cityData.lon.toString();

    const params = new URLSearchParams(searchParams.toString());
    params.set("city", cityData.city);
    params.set("country", cityData.country);
    params.set("lat", latStr);
    params.set("lon", lonStr);
    router.push(`${pathname}?${params.toString()}`);
  };

  const searchCityWithName = async (city: string) => {
    const targetCity = city.trim().toLowerCase();
    if (!targetCity) return;

    const geoData = await fetchGeoData(targetCity);

    const cityData = {
      city: geoData.results[0].name,
      country: geoData.results[0].country,
      lat: geoData.results[0].latitude,
      lon: geoData.results[0].longitude,
    };

    searchSelectedCity(cityData);
  };

  const handleKeydown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchCityWithName(inputValue);
      inputRef?.current?.blur();
      setIsOpen(false);
      setInputValue("");
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      if (inputRef.current) inputRef.current.blur();
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  return {
    handleChangeTab,
    searchSelectedCity,
    handleKeydown,
    handleChangeInput,
    resultData,
    isResultPending,
    searchCityWithName,
  };
}
