import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { useShallow } from "zustand/shallow";

import type { SearchBarProps } from "./SearchBar.types";

import { useSearchActions } from "@/hooks/useSearchActions";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import searchIcon from "@/public/icons/icon-search.svg";
import { useSearchStore } from "@/stores/useSearchStore";

export function SearchBar({ inputRef }: SearchBarProps) {
  const searchParams = useSearchParams();

  const lat = Number(searchParams.get("lat")) || 53.9;
  const lon = Number(searchParams.get("lon")) || 27.56667;
  const city = searchParams.get("city") || "Minsk";
  const country = searchParams.get("country") || "Belarus";
  const cityData = { lat, lon, city, country };

  const { error } = useWeatherQuery(cityData);
  const { searchCityWithName } = useSearchActions();
  const inputValue = useSearchStore((state) => state.inputValue);

  return (
    <div className="col-start-1 row-start-1 flex items-center w-full group">
      <Image
        src={searchIcon}
        className="w-5 h-5 mr-3 cursor-pointer shrink-0"
        alt="Search"
        onClick={() => searchCityWithName(inputValue)}
      />
      <SearchInput
        ref={inputRef}
        placeholder={
          error?.message === "GEOCODING_FAILED"
            ? "City not found..."
            : "Search for a place..."
        }
      />
    </div>
  );
}

export const SearchInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>((props, ref) => {
  const { setIsOpen, inputValue } = useSearchStore(
    useShallow((state) => ({
      setIsOpen: state.setIsOpen,
      inputValue: state.inputValue,
    })),
  );

  const { handleKeydown, handleChangeInput } = useSearchActions();

  return (
    <input
      {...props}
      ref={ref}
      aria-label="Search"
      value={inputValue}
      onKeyDown={(e) =>
        handleKeydown(e, ref as React.RefObject<HTMLInputElement>)
      }
      onChange={(e) => handleChangeInput(e)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setTimeout(() => setIsOpen(false), 1)}
      className="flex-1 min-w-0 bg-transparent placeholder-white/70 text-base sm:text-lg outline-none"
    />
  );
});
SearchInput.displayName = "SearchInput";
