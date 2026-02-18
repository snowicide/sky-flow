import { useSearchStore } from "@/stores/useSearchStore";
import { useShallow } from "zustand/shallow";
import type { ActiveTab } from "@/components/SearchSection/SearchField.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useSearchQuery } from "./useSearchQuery";

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

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChangeTab = (value: ActiveTab) => {
    setCurrentTab(value);
  };

  const searchSelectedCity = (
    city?: string,
    inputRef?: React.RefObject<HTMLInputElement | null>,
  ) => {
    const targetCity = (city || inputValue.trim()).toLowerCase();
    if (!targetCity) return;

    inputRef?.current?.blur();
    setIsOpen(false);
    setInputValue("");

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
    resultData,
    isResultPending,
  };
}
