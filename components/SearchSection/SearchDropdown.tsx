import Image from "next/image";
import searchIcon from "@/public/icons/icon-search.svg";
import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ActiveTab, SearchDropdownProps } from "@/types/SearchDropdown";
import { FeaturedIcon, HistoryIcon } from "@/components/icons";
import RecentSearch from "./RecentSearch";
import FeaturedSearch from "./FeaturedSearch";

export default function SearchDropdown({
  inputValue,
  setInputValue,
}: SearchDropdownProps) {
  const [currentTab, setCurrentTab] = useState<ActiveTab>("recent");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lastSearches = [
    { name: "Minsk, Belarus", value: "Minsk" },
    { name: "Moscow, Russia", value: "Moscow" },
    { name: "London, United Kingdom", value: "London" },
    { name: "Alice, United States", value: "Alice" },
    { name: "Berlin, Germany", value: "Berlin" },
    { name: "Paris, France", value: "Paris" },
    { name: "Tokyo, Japan", value: "Tokyo" },
    { name: "New York, United States", value: "New York" },
  ];

  const featuredSearches = [
    { name: "Minsk, Belarus", value: "Minsk" },
    { name: "Tokyo, Japan", value: "Tokyo" },
  ];

  const handleChangeTab = (value: ActiveTab) => {
    setCurrentTab(value);
  };

  const handleOptionSelect = async (city: string) => {
    if (!city) return;
    setIsOpen(false);
    if (inputRef.current) inputRef.current.blur();
    setInputValue("");

    const params = new URLSearchParams(searchParams.toString());
    params.set("city", city);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const city = inputValue.trim();
      if (city) {
        handleOptionSelect(city);
      }
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      if (inputRef.current) inputRef.current.blur();
    }
  };

  return (
    <div className="relative grid w-full">
      {/* search bar */}
      <div className="col-start-1 row-start-1 flex items-center w-full group">
        <Image
          src={searchIcon}
          className="w-5 h-5 mr-3 cursor-pointer shrink-0"
          alt="Search"
          onClick={() => {
            const city = inputValue.trim();
            if (city) {
              handleOptionSelect(city);
            }
          }}
        />
        <input
          ref={inputRef}
          aria-label="Search"
          className="flex-1 min-w-0 bg-transparent placeholder-white/70 text-base sm:text-lg outline-none"
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          value={inputValue}
          placeholder="Search for a place..."
        />
      </div>
      {/* dropdown */}
      {isOpen && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute -left-5 top-6 -right-4 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-100 mt-1"
        >
          {/* recents/featured tabs */}
          <div className="flex items-center border-b border-white/10 mx-6 py-5">
            <div className="flex-1">
              <div
                className={`flex w-auto justify-center items-center flex-1 mx-auto text-xl font-bold tracking-wider ${currentTab === "recent" ? "text-[hsl(233,100%,70%)]" : ""}`}
              >
                <div
                  onClick={() => handleChangeTab("recent")}
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition"
                >
                  <HistoryIcon className="w-4.25 h-4.25 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-lg lg:text-xl">Recent</span>
                </div>
              </div>
            </div>
            <div className="flex-1 h-full">
              <div
                className={`flex items-center h-full justify-center mx-auto text-xl font-bold tracking-wider ${currentTab === "featured" ? "text-[hsl(233,100%,70%)]" : ""}`}
              >
                <div
                  onClick={() => handleChangeTab("featured")}
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition"
                >
                  <div>
                    <FeaturedIcon
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      allowFill={false}
                      currentTab={currentTab}
                    />
                  </div>
                  <span className="text-sm sm:text-lg lg:text-xl">
                    Featured
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="max-h-auto overflow-y-auto">
            {currentTab === "recent" &&
              lastSearches.map((city, index) => (
                <RecentSearch
                  key={`${city.name}-${index}`}
                  city={city}
                  index={index}
                  handleOptionSelect={handleOptionSelect}
                />
              ))}

            {currentTab === "featured" &&
              featuredSearches.map((city, index) => (
                <FeaturedSearch
                  key={`${city.name}-${index}`}
                  featuredSearches={featuredSearches}
                  city={city}
                  index={index}
                  handleOptionSelect={handleOptionSelect}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
