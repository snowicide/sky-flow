import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchStore } from "@/stores/useSearchStore";
import { useShallow } from "zustand/shallow";
import type { ActiveTab } from "@/components/SearchSection/SearchField.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { addCity } = useSearchHistory();

  const handleChangeTab = (value: ActiveTab) => {
    setCurrentTab(value);
  };

  const searchSelectedCity = async (
    city?: string,
    inputRef?: React.RefObject<HTMLInputElement | null>,
  ) => {
    // if not clicked recent - using input value
    const targetCity = city || inputValue.trim();
    if (!targetCity) return;

    inputRef?.current?.blur();
    setIsOpen(false);
    setInputValue("");

    // get country
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(targetCity)}&count=1`,
    );

    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData.results?.[0]) {
        const country = geoData.results[0].country || "Unknown";
        addCity(targetCity, country);
      }
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("city", targetCity);
    router.push(`${pathname}?${params.toString().toLowerCase()}`);
  };

  const handleKeydown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchSelectedCity(undefined, inputRef);
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
  };
}
