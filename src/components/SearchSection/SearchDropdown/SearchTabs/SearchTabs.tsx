import { useShallow } from "zustand/shallow";

import { FavoriteIcon, HistoryIcon } from "@/components/icons";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchStore } from "@/stores/useSearchStore";
import type { ActiveTab } from "@/types/history";

import { CurrentTab } from "./CurrentTab";

export function SearchTabs({
  inputRef,
  handleChangeTab,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleChangeTab: (value: ActiveTab) => void;
}) {
  const { currentTab, isOpen } = useSearchStore(
    useShallow((state) => ({
      currentTab: state.currentTab,
      isOpen: state.isOpen,
    })),
  );

  const { recent, favorites } = useSearchHistory();

  return (
    <div
      role="listbox"
      onMouseDown={(e) => e.preventDefault()}
      className={`absolute -left-5 top-5 sm:top-6 right-0 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-100 mt-1 ${isOpen ? "visible" : "invisible"}`}
    >
      {/* recents/favorites tabs */}
      <ul
        role="tablist"
        className="flex items-center border-b border-white/10 mx-6 py-5"
      >
        <li
          role="tab"
          aria-selected={currentTab === "recent"}
          aria-label="Recent searches"
          onClick={() => handleChangeTab("recent")}
          className={`gap-1.5 cursor-pointer hover:opacity-80 transition flex w-auto justify-center items-center flex-1 mx-auto text-xl font-bold tracking-wider ${currentTab === "recent" ? "text-[hsl(233,100%,70%)]" : ""}`}
        >
          <HistoryIcon className="w-4.25 h-4.25 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-lg lg:text-xl whitespace-nowrap">
            Recent ({recent.length})
          </span>
        </li>
        <li
          role="tab"
          aria-selected={currentTab === "favorites"}
          aria-label="Favorites searches"
          onClick={() => handleChangeTab("favorites")}
          className={`flex-1 gap-1.5 cursor-pointer hover:opacity-80 transition flex items-center h-full justify-center mx-auto text-xl font-bold tracking-wider ${currentTab === "favorites" ? "text-[hsl(233,100%,70%)]" : ""}`}
        >
          <FavoriteIcon
            className="w-4 h-4 sm:w-5 sm:h-5"
            allowFill={false}
            currentTab={currentTab}
          />
          <span className="text-sm sm:text-lg lg:text-xl whitespace-nowrap">
            Favorites ({favorites.length})
          </span>
        </li>
      </ul>

      <CurrentTab inputRef={inputRef} />
    </div>
  );
}
