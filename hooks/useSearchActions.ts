import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchStore } from "@/stores/useSearchStore";
import { useShallow } from "zustand/shallow";
import type { ActiveTab } from "@/components/SearchSection/SearchField.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchWeatherData } from "@/services/fetchWeatherData";

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
    const targetCity = (city || inputValue.trim()).toLowerCase();
    if (!targetCity) return;

    inputRef?.current?.blur();
    setIsOpen(false);
    setInputValue("");

    const data = await fetchWeatherData(targetCity);

    if (data?.success) {
      const country = data.data.current.country || "Unknown";
      // always lowercase
      addCity(targetCity, country?.toLowerCase());
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("city", targetCity);
    router.push(`${pathname}?${params.toString()}`);
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
