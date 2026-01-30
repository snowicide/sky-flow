"use client";
import Image from "next/image";
import searchIcon from "@/public/icons/icon-search.svg";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";

export default function SearchSection() {
  const [inputValue, setInputValue] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cityFromUrl = searchParams.get("city") || "Minsk";
  const { isPending, isError } = useWeatherQuery(cityFromUrl);

  const handleSearch = () => {
    const city = inputValue.trim();
    if (!city) return;

    const params = new URLSearchParams();
    params.set("city", city);
    router.push(`${pathname}?${params.toString()}`);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") e.currentTarget.blur();
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
          <Image
            src={searchIcon}
            className="w-5 h-5 mr-3 group-hover:opacity-75 group-focus-within:opacity-75"
            alt="Search"
          />
          <input
            className="flex-1 bg-transparent placeholder-white/70 text-base sm:text-lg outline-none"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            value={inputValue}
            disabled={isPending}
            placeholder="Search for a place..."
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
