"use client";
import Image from "next/image";
import searchIcon from "@/public/icons/icon-search.svg";
import { searchWeather, type WeatherResponse } from "@/app/actions";
import { useWeatherStore } from "@/store/useWeatherStore";
import { useState } from "react";

export default function SearchSection() {
  const [localSearch, setLocalSearch] = useState<string>("");
  const { setLoading, setError, setWeatherData, isLoading, weatherData } =
    useWeatherStore();

  const handleSearchButton = async () => {
    if (!localSearch.trim()) return;
    setLoading(true);
    setError(null);
    const city = localSearch
      .trim()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    try {
      const result: WeatherResponse = await searchWeather(city);

      if (result.success) {
        setWeatherData(result.data);
        setLocalSearch("");
      } else {
        console.error("Search error: ", result.error);
      }
    } catch (error) {
      setError("Unknown error.");
      console.error("Unknown error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") handleSearchButton();
  };

  return (
    <div className="mb-10">
      <h1 className="text-5xl max-w-80 sm:max-w-full leading-tight justify-self-center sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-10">
        How&apos;s the sky looking today?
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
        <div className="flex items-center flex-1 bg-[hsl(243,27%,20%)] rounded-xl px-4 py-3">
          <Image src={searchIcon} className="w-5 h-5 mr-3" alt="Search" />
          <input
            className="flex-1 bg-transparent placeholder-white/70 text-base sm:text-lg outline-none"
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            value={localSearch}
            disabled={isLoading}
            placeholder="Search for a place..."
          />
        </div>
        <button
          onClick={handleSearchButton}
          className="bg-[hsl(233,67%,56%)] text-white font-medium py-3 px-6 rounded-xl text-base sm:text-lg whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </div>
    </div>
  );
}
