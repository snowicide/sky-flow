import { FeaturedIcon } from "@/components/icons";
import type { FeaturedTabProps } from "./SearchField.types";
import { useSearchActions } from "@/hooks/useSearchActions";
import { useSearchHistory } from "@/hooks/useSearchHistory";

export function FeaturedSearch({ data, inputRef }: FeaturedTabProps) {
  const { searchSelectedCity } = useSearchActions();
  const { removeFavorite } = useSearchHistory();

  const city = data.city.charAt(0).toUpperCase() + data.city.slice(1);
  const country = data.country.charAt(0).toUpperCase() + data.country.slice(1);

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
        onClick={() => searchSelectedCity(city, inputRef)}
        className="flex flex-1 items-center gap-1 sm:gap-2 cursor-pointer font-normal text-sm sm:text-base md:text-lg"
      >
        {`${city}, ${country}`}
      </div>

      <button
        role="button"
        aria-label="Remove from featured"
        onClick={() => removeFavorite(data.id)}
        className="flex items-center gap-1 sm:gap-3 opacity-70"
      >
        <FeaturedIcon
          isFilled={true}
          className="w-5 h-5 sm:w-6 sm:h-6 focus:outline-none hover:text-[hsl(233,100%,70%)] transition duration-100 cursor-pointer"
        />
      </button>
    </li>
  );
}
