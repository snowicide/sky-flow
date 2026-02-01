import { FeaturedIcon, HistoryIcon, XIcon } from "@/components/icons";
import { RecentTabProps } from "@/types/SearchDropdown";

export default function RecentSearch({
  name,
  value,
  index,
  handleOptionSelect,
}: RecentTabProps) {
  return (
    <div
      key={`${name}-${index}`}
      className="flex justify-between font-medium mx-2 px-5 py-3 my-3 text-white hover:bg-[hsl(243,23%,30%)] rounded-xl"
    >
      <div
        onClick={() => handleOptionSelect(value)}
        className="flex flex-1 items-center gap-1 sm:gap-2 cursor-pointer"
      >
        <HistoryIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="font-normal text-sm sm:text-base md:text-lg">
          {name}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 opacity-70">
        <FeaturedIcon className="w-5 h-5 sm:w-6 sm:h-6 focus:outline-none hover:text-[hsl(233,100%,70%)] transition duration-100 cursor-pointer" />
        <XIcon className="w-5.5 h-5.5 sm:w-6 sm:h-6 hover:text-red-400 cursor-pointer" />
      </div>
    </div>
  );
}
