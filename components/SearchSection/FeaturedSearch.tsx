import { FeaturedIcon } from "@/components/icons";
import { FeaturedTabProps } from "@/types/SearchDropdown";

export default function FeaturedSearch({
  data,
  searchSelectedCity,
  removeFavorite,
}: FeaturedTabProps) {
  const city = data.city.charAt(0).toUpperCase() + data.city.slice(1);
  const country = data.country.charAt(0).toUpperCase() + data.country.slice(1);

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

      <div
        onClick={() => removeFavorite(data.id)}
        className="flex items-center gap-1 sm:gap-3 opacity-70"
      >
        <FeaturedIcon
          isFilled={true}
          className="w-5 h-5 sm:w-6 sm:h-6 focus:outline-none hover:text-[hsl(233,100%,70%)] transition duration-100 cursor-pointer"
        />
      </div>
    </div>
  );
}
