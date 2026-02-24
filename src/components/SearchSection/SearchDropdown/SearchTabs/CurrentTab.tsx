import { useShallow } from "zustand/shallow";

import { RecentAlertIcon, UnfavoriteIcon } from "@/components/icons";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchStore } from "@/stores/useSearchStore";

import { FavoritesSearch } from "./FavoritesSearch";
import { RecentSearch } from "./RecentSearch";

export function CurrentTab({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { currentTab } = useSearchStore(
    useShallow((state) => ({
      currentTab: state.currentTab,
    })),
  );

  const { recent, favorites } = useSearchHistory();

  return (
    <ul className="max-h-auto overflow-y-auto">
      {currentTab === "recent" &&
        (recent.length >= 1 ? (
          recent.map((data, index) => (
            <RecentSearch
              key={`${data.id}-${index}`}
              data={data}
              inputRef={inputRef}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-items-center my-20 sm:my-30 gap-2">
            <RecentAlertIcon className="w-8 h-8" />
            <span className="text-base sm:text-lg font-bold tracking-wider text-white/90 text-center">
              There is no city you seen recently!
            </span>
          </div>
        ))}

      {currentTab === "favorites" &&
        (favorites.length >= 1 ? (
          favorites.map((data, index) => (
            <FavoritesSearch
              key={`${data.id}-${index}`}
              data={data}
              inputRef={inputRef}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-items-center my-20 sm:my-30 gap-2">
            <UnfavoriteIcon className="w-8 h-8" />
            <span className="text-base sm:text-lg font-bold tracking-wider text-white/90 text-center">
              There is no city you have in favorites!
            </span>
          </div>
        ))}
    </ul>
  );
}
