"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import SearchDropdown from "./SearchDropdown";
import { useSearchHistoryStore } from "@/stores/useSearchStore";
import { useShallow } from "zustand/shallow";

export default function SearchSection() {
  const { inputValue, setInputValue } = useSearchHistoryStore(
    useShallow((state) => ({
      inputValue: state.inputValue,
      setInputValue: state.setInputValue,
    })),
  );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cityFromUrl = searchParams.get("city") || "Minsk";
  const { isError } = useWeatherQuery(cityFromUrl);

  const handleSearch = () => {
    const city = inputValue.trim();
    if (!city) return;

    const params = new URLSearchParams();
    params.set("city", city);
    router.push(`${pathname}?${params.toString()}`);
    setInputValue("");
  };

  return (
    <div className="mb-10">
      <h1 className="text-5xl max-w-80 sm:max-w-full leading-tight justify-self-center sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-15">
        How&apos;s the sky looking today?
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
        <div
          className={`flex items-center flex-1 group bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,27%,20%)]/80 focus-within:bg-[hsl(243,27%,20%)]/80 focus-within:ring-2 focus-within:ring-[hsl(233,67%,56%)] transition duration-75 rounded-xl px-4 py-3 ${isError ? "ring-1 ring-red-500/80" : ""}`}
        >
          <SearchDropdown
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-[hsl(233,67%,56%)] text-white font-medium py-3 px-6 rounded-xl text-base sm:text-lg whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </div>
    </div>
  );
}
