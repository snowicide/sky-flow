import { FeaturedIcon, XIcon } from "@/components/icons";
import type { RecentTabProps } from "./SearchField.types";
import { useSearchActions } from "@/hooks/useSearchActions";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { HistoryItem } from "./SearchHistory.types";

export function RecentSearch({ data, inputRef }: RecentTabProps) {
  const { searchSelectedCity } = useSearchActions();

  const { toggleFavorite, removeCity, recent } = useSearchHistory();

  const city =
    data.city.charAt(0).toUpperCase() + data.city.slice(1).toLocaleLowerCase();
  const country =
    data.country.charAt(0).toUpperCase() + data.country.slice(1).toLowerCase();

  const handleFeaturedIcon = () => {
    toggleFavorite(data.id);
  };

  const handleClick = async () => {
    const cityData = {
      lat: data.latitude,
      lon: data.longitude,
      city: data.city,
      country: data.country,
    };
    searchSelectedCity(cityData, inputRef);
  };

  const currentRecent = recent.filter(
    (item: HistoryItem) => item.id === data.id,
  )[0];

  return (
    <li
      role="option"
      aria-selected="false"
      aria-label={`${city}, ${country}`}
      className="flex justify-between font-medium mx-2 px-5 py-3 my-3 text-white hover:bg-[hsl(243,23%,30%)] rounded-xl"
    >
      <div
        role="button"
        aria-label={`Select ${city}`}
        onClick={handleClick}
        className="font-normal text-sm sm:text-base md:text-lg flex flex-1 items-center gap-1 sm:gap-2 cursor-pointer"
      >
        {`${city}, ${country}`}
      </div>

      <div className="flex items-center gap-1 sm:gap-3 opacity-70">
        <button
          role="button"
          aria-label="Toggle favorite"
          onClick={handleFeaturedIcon}
        >
          <FeaturedIcon
            isFeatured={currentRecent?.isFavorite}
            className="w-5 h-5 sm:w-6 sm:h-6 focus:outline-none hover:text-[hsl(233,100%,70%)] transition duration-100 cursor-pointer"
          />
        </button>
        <button
          role="button"
          aria-label="Remove from history"
          onClick={() => removeCity(data.id)}
        >
          <XIcon className="w-5.5 h-5.5 sm:w-6 sm:h-6 hover:text-red-400 cursor-pointer" />
        </button>
      </div>
    </li>
  );
}
