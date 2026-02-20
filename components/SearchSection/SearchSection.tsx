"use client";
import { useSearchStore } from "@/stores/useSearchStore";
import { SearchField } from "./SearchField";
import { useSearchActions } from "@/hooks/useSearchActions";
import { useSearchParams } from "next/navigation";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

export default function SearchSection() {
  const { searchCityWithName } = useSearchActions();
  const { inputValue, _hasHydrated, setIsOpen } = useSearchStore(
    useShallow((state) => ({
      inputValue: state.inputValue,
      _hasHydrated: state._hasHydrated,
      setIsOpen: state.setIsOpen,
    })),
  );
  const { addCity } = useSearchHistory();
  const searchParams = useSearchParams();

  const isSync = useRef(false);

  useEffect(() => {
    if (isSync.current || !_hasHydrated) return;

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const city = searchParams.get("city");
    const country = searchParams.get("country");

    if (lat && lon && city && country) {
      setIsOpen(false);
      addCity(city, country, +lat, +lon);
    }
    isSync.current = true;
  }, [addCity, searchParams, _hasHydrated, setIsOpen]);

  return (
    <section className="mb-10">
      <h1 className="text-5xl max-w-80 sm:max-w-full leading-tight justify-self-center sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-15">
        How&apos;s the sky looking today?
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchCityWithName(inputValue);
        }}
        className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
      >
        <SearchField />
        <button className="bg-[hsl(233,67%,56%)] text-white font-medium py-3 px-6 rounded-xl text-base sm:text-lg whitespace-nowrap hover:opacity-90 transition-opacity">
          Search
        </button>
      </form>
    </section>
  );
}
