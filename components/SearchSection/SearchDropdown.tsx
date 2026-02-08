import { useSearchActions } from "@/hooks/useSearchActions";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchStore } from "@/stores/useSearchStore";
import { useShallow } from "zustand/shallow";
import { FeaturedIcon, HistoryIcon } from "../icons";
import { RecentSearch } from "./RecentSearch";
import { FeaturedSearch } from "./FeaturedSearch";

export function SearchDropdown({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { isOpen, currentTab } = useSearchStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      currentTab: state.currentTab,
    })),
  );

  const { handleChangeTab } = useSearchActions();

  const { recent, favorites } = useSearchHistory();

  return (
    <>
      <div
        role="listbox"
        onMouseDown={(e) => e.preventDefault()}
        className={`absolute -left-5 top-6 -right-4 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-100 mt-1 ${isOpen ? "visible" : "invisible"}`}
      >
        {/* recents/featured tabs */}
        <ul
          role="tablist"
          className="flex items-center border-b border-white/10 mx-6 py-5"
        >
          <li
            onClick={() => handleChangeTab("recent")}
            className={` gap-1.5 cursor-pointer hover:opacity-80 transition flex w-auto justify-center items-center flex-1 mx-auto text-xl font-bold tracking-wider ${currentTab === "recent" ? "text-[hsl(233,100%,70%)]" : ""}`}
          >
            <HistoryIcon className="w-4.25 h-4.25 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-lg lg:text-xl">
              Recent ({recent.length})
            </span>
          </li>
          <li
            onClick={() => handleChangeTab("featured")}
            className={`flex-1 gap-1.5 cursor-pointer hover:opacity-80 transition flex items-center h-full justify-center mx-auto text-xl font-bold tracking-wider ${currentTab === "featured" ? "text-[hsl(233,100%,70%)]" : ""}`}
          >
            <FeaturedIcon
              className="w-4 h-4 sm:w-5 sm:h-5"
              allowFill={false}
              currentTab={currentTab}
            />
            <span className="text-sm sm:text-lg lg:text-xl">
              Featured ({favorites.length})
            </span>
          </li>
        </ul>
        {/* current tab */}
        <ul className="max-h-auto overflow-y-auto">
          {currentTab === "recent" &&
            recent.map((data, index) => (
              <RecentSearch
                key={`${data.id}-${index}`}
                data={data}
                inputRef={inputRef}
              />
            ))}
          {currentTab === "featured" &&
            favorites.map((data, index) => (
              <FeaturedSearch
                key={`${data.id}-${index}`}
                data={data}
                inputRef={inputRef}
              />
            ))}
        </ul>
      </div>
    </>
  );
}
