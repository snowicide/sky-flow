import Image from "next/image";
import searchIcon from "@/public/icons/icon-search.svg";
import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ActiveTab, SearchDropdownProps } from "@/types/SearchDropdown";

const lastSearches = [
  { name: "Minsk, Belarus", value: "Minsk" },
  { name: "Moscow, Russia", value: "Moscow" },
  { name: "London, United Kingdom", value: "London" },
  { name: "Alice, United States", value: "Alice" },
  { name: "Berlin, Germany", value: "Berlin" },
];

export default function SearchDropdown({
  inputValue,
  setInputValue,
}: SearchDropdownProps) {
  const [isActive, setIsActive] = useState<ActiveTab>("recent");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChangeTab = (value: ActiveTab) => {
    setIsActive(value);
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
      {isOpen && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute -left-5 top-6 -right-4 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-100 mt-1"
        >
          {/* recents/featured tabs */}
          <div className="flex border-b border-white/10 mx-6 py-5">
            <div className="flex-1">
              <div
                className={`flex justify-center flex-1 mx-auto text-xl font-bold tracking-wider hover:opacity-80 transition ${isActive === "recent" ? "text-[hsl(233,100%,70%)] underline" : ""}`}
              >
                <span
                  className="cursor-pointer"
                  onClick={() => handleChangeTab("recent")}
                >
                  Recent
                </span>
              </div>
            </div>
            <div className="flex-1 h-full">
              <div
                className={`flex h-full justify-center mx-auto text-xl font-bold tracking-wider hover:opacity-80 transition ${isActive === "featured" ? "text-[hsl(233,100%,70%)] underline" : ""}`}
              >
                <span
                  className="cursor-pointer"
                  onClick={() => handleChangeTab("featured")}
                >
                  Featured
                </span>
              </div>
            </div>
          </div>
          <div className="max-h-auto overflow-y-auto">
            {lastSearches.map(({ name, value }, index) => (
              <div
                key={`${name}-${index}`}
                className="font-medium mx-2 px-5 py-3 my-3 cursor-pointer text-white hover:bg-[hsl(243,23%,30%)] rounded-xl"
                onClick={() => handleOptionSelect(value)}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
