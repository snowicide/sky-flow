import { useSearchActions } from "@/hooks/useSearchActions";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSearchStore } from "@/stores/useSearchStore";
import { useShallow } from "zustand/shallow";
import { RecentSearch } from "./RecentSearch";
import { FavoritesSearch } from "./FavoritesSearch";
import { SearchResultCity } from "./SearchResultCity";
import { SearchDropdownSkeleton } from "./SearchDropdown.skeleton";
import {
  FailedSearchIcon,
  FavoriteIcon,
  HistoryIcon,
  RecentAlertIcon,
  UnfavoriteIcon,
} from "../icons";
import { SearchIcon } from "../icons/SearchIcon";

export function SearchDropdown({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { isOpen, currentTab, inputValue } = useSearchStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      currentTab: state.currentTab,
      inputValue: state.inputValue,
    })),
  );

  const { recent, favorites } = useSearchHistory();

  const { resultData, shouldSearchSkeleton, handleChangeTab } =
    useSearchActions();

  const isNotEnoughChars = inputValue.length > 0 && inputValue.length < 2;
  return (
    <>
      <div
        role="listbox"
        onMouseDown={(e) => e.preventDefault()}
        className={`absolute -left-5 top-5 sm:top-6 right-0 col-start-1 row-start-2 bg-[hsl(243,27%,20%)] border border-white/10 rounded-xl shadow-[0_10px_12px_black]/25 z-100 mt-1 ${isOpen ? "visible" : "invisible"}`}
      >
        {inputValue.trim().length === 0 ? (
          <>
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
                className={` gap-1.5 cursor-pointer hover:opacity-80 transition flex w-auto justify-center items-center flex-1 mx-auto text-xl font-bold tracking-wider ${currentTab === "recent" ? "text-[hsl(233,100%,70%)]" : ""}`}
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
            {/* current tab */}
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
          </>
        ) : // search results
        resultData ? (
          <ul className="h-112 lg:h-128 xl:h-148.25">
            {resultData.map(
              ({
                id,
                city,
                country,
                temperature,
                temperatureUnit,
                weatherCode,
              }) => (
                <SearchResultCity
                  key={id}
                  id={id}
                  city={city}
                  country={country}
                  temperature={temperature}
                  temperatureUnit={temperatureUnit}
                  weatherCode={weatherCode}
                  resultData={resultData}
                />
              ),
            )}
          </ul>
        ) : shouldSearchSkeleton ? (
          <SearchDropdownSkeleton />
        ) : (
          !resultData && (
            <div className="h-75 flex flex-col items-center justify-center mb-5 gap-5">
              {isNotEnoughChars ? (
                <SearchIcon className="w-22 h-22 opacity-50" stroke="#60A5FA" />
              ) : (
                <FailedSearchIcon
                  className="w-22 h-22 opacity-50"
                  stroke="#60A5FA"
                />
              )}
              <span className="text-[#BFDBFE] opacity-75 text-base font-medium tracking-wide text-center">
                {isNotEnoughChars
                  ? `Type at least 2 characters to search...`
                  : inputValue.length <= 50
                    ? `City ${inputValue} not found!`
                    : "City not found!"}
              </span>
            </div>
          )
        )}
      </div>
    </>
  );
}
