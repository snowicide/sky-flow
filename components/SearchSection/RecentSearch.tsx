import { FeaturedIcon, XIcon } from "@/components/icons";
import { useState } from "react";
import type { RecentTabProps } from "./SearchField.types";

export function RecentSearch({
  data,
  searchSelectedCity,
  toggleFavorite,
  removeCity,
}: RecentTabProps) {
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const city =
    data.city.charAt(0).toUpperCase() + data.city.slice(1).toLocaleLowerCase();
  const country =
    data.country.charAt(0).toUpperCase() + data.country.slice(1).toLowerCase();

  const handleFeaturedIcon = () => {
    toggleFavorite(data.id, isFeatured);
    setIsFeatured((prev) => !prev);
  };

  return (
    <div className="flex justify-between font-medium mx-2 px-5 py-3 my-3 text-white hover:bg-[hsl(243,23%,30%)] rounded-xl">
      <div
        onClick={() => searchSelectedCity(city)}
        className="flex flex-1 items-center gap-1 sm:gap-2 cursor-pointer"
      >
        <span className="font-normal text-sm sm:text-base md:text-lg">
          {`${city}, ${country}`}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 opacity-70">
        <div onClick={handleFeaturedIcon}>
          <FeaturedIcon
            isFeatured={isFeatured}
            className="w-5 h-5 sm:w-6 sm:h-6 focus:outline-none hover:text-[hsl(233,100%,70%)] transition duration-100 cursor-pointer"
          />
        </div>
        <div onClick={() => removeCity(data.id)}>
          <XIcon className="w-5.5 h-5.5 sm:w-6 sm:h-6 hover:text-red-400 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
