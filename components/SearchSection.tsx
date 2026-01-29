"use client";
import Image from "next/image";
import searchIcon from "@/public/icons/icon-search.svg";
import { useWeatherStore } from "@/store/useWeatherStore";
import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { fetchWeatherData } from "@/services/fetchWeatherData";

type SearchStatus = "idle" | "searching" | "success" | "error";

export default function SearchSection() {
  const { setLoading, setWeatherData, isLoading, setError } = useWeatherStore(
    useShallow((state) => ({
      setLoading: state.setLoading,
      isLoading: state.isLoading,
      setError: state.setError,
      setWeatherData: state.setWeatherData,
    })),
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [status, setStatus] = useState<SearchStatus>("idle");
  const lastSearchRef = useRef<string>("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // if have not /?city=
  useEffect(() => {
    const city = searchParams.get("city");
    if (!city) {
      setStatus("searching");
      setLoading(true);
      const initialFetch = async () => {
        try {
          const result = await fetchWeatherData("Minsk");
          if (result.success) {
            setWeatherData(result.data, result.validatedCity);
            setError(null);

            const params = new URLSearchParams();
            params.set("city", "Minsk");
            router.replace(`/?${params.toString()}`);
            setStatus("success");
            setTimeout(() => setStatus("idle"), 100);
          } else {
            setStatus("error");
            setError(result.error.message);
          }
        } catch {
          setStatus("error");
          setError("Network error");
        } finally {
          setLoading(false);
        }
      };
      initialFetch();
    }
  }, [searchParams, router, setWeatherData, setError, setLoading]);

  const handleSearch = async () => {
    const city = inputValue.trim();
    if (!city) {
      setInputValue("");
      setStatus("error");
      return;
    }
    if (city === lastSearchRef.current && status !== "error") return;

    lastSearchRef.current = city;
    setStatus("searching");
    setLoading(true);

    try {
      const result = await fetchWeatherData(city);
      if (result.success) {
        setWeatherData(result.data, result.validatedCity);
        setError(null);

        const params = new URLSearchParams();
        params.set("city", result.validatedCity);
        router.push(`${pathname}?${params.toString()}`);
        setInputValue("");
        setStatus("success");
        setTimeout(() => setStatus("idle"), 500);
      } else {
        const params = new URLSearchParams();
        params.set("city", inputValue);
        router.push(`${pathname}?${params.toString()}`);
        setStatus("error");
        setError(result.error.message);
      }
    } catch {
      setStatus("error");
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
          className={`flex items-center flex-1 group bg-[hsl(243,27%,20%)] hover:bg-[hsl(243,27%,20%)]/80 focus-within:bg-[hsl(243,27%,20%)]/80 focus-within:ring-2 focus-within:ring-[hsl(233,67%,56%)] transition duration-75 rounded-xl px-4 py-3 ${status === "error" ? "ring-1 ring-red-500/80" : ""}`}
        >
          <Image
            src={searchIcon}
            className="w-5 h-5 mr-3 group-hover:opacity-75 group-focus-within:opacity-75"
            alt="Search"
          />
          <input
            className="flex-1 bg-transparent placeholder-white/70 text-base sm:text-lg outline-none"
            onChange={(e) => {
              setInputValue(e.target.value);
              setStatus("searching");
            }}
            onKeyDown={handleKeyDown}
            value={inputValue}
            disabled={isLoading}
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
