import { useShallow } from "zustand/shallow";

import { useSearchActions } from "@/hooks/useSearchActions";
import { useSearchStore } from "@/stores/useSearchStore";

import { SearchPlaceholder } from "./Results/SearchPlaceholder";
import { SearchResultCity } from "./Results/SearchResultCity";
import { SearchResultsSkeleton } from "./Results/SearchResults.skeleton";
import { SearchTabs } from "./SearchTabs/SearchTabs";

export function SearchDropdown({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { isOpen, inputValue } = useSearchStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      inputValue: state.inputValue,
    })),
  );

  const { resultData, shouldSearchSkeleton, handleChangeTab } =
    useSearchActions();

  if (inputValue.trim().length === 0) {
    return <SearchTabs handleChangeTab={handleChangeTab} inputRef={inputRef} />;
  }

  if (shouldSearchSkeleton) {
    return <SearchResultsSkeleton />;
  }

  if (!resultData) {
    return <SearchPlaceholder inputValue={inputValue} />;
  }

  return (
    <>
      <div
        role="listbox"
        onMouseDown={(e) => e.preventDefault()}
        className={`absolute -left-5 top-5 sm:top-6 right-0 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-100 mt-1 ${isOpen ? "visible" : "invisible"}`}
      >
        <ul className="h-112 lg:h-128 xl:h-151.5">
          {resultData.map((data) => (
            <SearchResultCity
              key={data.id}
              data={data}
              resultData={resultData}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
