import { FailedSearchIcon } from "@/components/icons";
import { SearchIcon } from "@/components/icons/SearchIcon";

export function SearchPlaceholder({ inputValue }: { inputValue: string }) {
  const isNotEnoughChars = inputValue.length > 0 && inputValue.length < 2;

  return (
    <div className="h-75 flex flex-col items-center justify-center mb-5 gap-5">
      {isNotEnoughChars ? (
        <SearchIcon className="w-22 h-22 opacity-50" stroke="#60A5FA" />
      ) : (
        <FailedSearchIcon className="w-22 h-22 opacity-50" stroke="#60A5FA" />
      )}
      <span className="text-[#BFDBFE] opacity-75 text-base font-medium tracking-wide text-center">
        {isNotEnoughChars
          ? `Type at least 2 characters to search...`
          : inputValue.length <= 50
            ? `City ${inputValue} not found!`
            : "City not found!"}
      </span>
    </div>
  );
}
