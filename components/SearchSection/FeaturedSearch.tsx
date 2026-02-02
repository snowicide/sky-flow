import { FeaturedIcon } from "@/components/icons";
import { SearchTabProps } from "@/types/SearchDropdown";

export default function FeaturedSearch({
  city,
  index,
  handleOptionSelect,
  featuredSearches,
}: SearchTabProps) {
  return (
    <div
      key={`${city.name}-${index}`}
      className="flex justify-between font-medium mx-2 px-5 py-3 my-3 text-white hover:bg-[hsl(243,23%,30%)] rounded-xl"
    >
      <div
        onClick={() => handleOptionSelect(city.value)}
        className="flex flex-1 items-center gap-1 sm:gap-2 cursor-pointer"
      >
        <span className="font-normal text-sm sm:text-base md:text-lg">
          {city.name}
        </span>
      </div>

      <div
        onClick={() => featuredSearches?.splice(index, 1)}
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
