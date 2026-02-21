import { useRef } from "react";
import { SearchBar } from "./SearchBar";
import { SearchDropdown } from "./SearchDropdown";
import { useSearchParams } from "next/navigation";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";

export function SearchField() {
  const inputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const lat = Number(searchParams.get("lat")) || 53.9;
  const lon = Number(searchParams.get("lon")) || 27.56667;
  const city = searchParams.get("city") || "Minsk";
  const country = searchParams.get("country") || "Belarus";
  const cityData = { lat, lon, city, country };

  const { isError } = useWeatherQuery(cityData);

  return (
    <div
      role="group"
      aria-label="Search input group"
      className={`relative grid w-full items-center flex-1 group bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,27%,20%)]/80 focus-within:bg-[hsl(243,27%,20%)]/80 focus-within:ring-2 focus-within:ring-[hsl(233,67%,56%)] transition duration-75 rounded-xl px-4 py-3 ${isError ? "ring-1 ring-red-500/50" : ""}`}
    >
      <SearchBar inputRef={inputRef} />
      <SearchDropdown inputRef={inputRef} />
    </div>
  );
}
