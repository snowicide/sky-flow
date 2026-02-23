import type { ActiveTab } from "@/components/SearchSection/SearchField.types";
import type { CityData } from "@/types/api/CityData";
import type { SearchDataItem } from "@/types/api/SearchData";

export interface UseSearchActionsReturn {
  handleChangeTab: (value: ActiveTab) => void;
  searchSelectedCity: (
    cityData: CityData,
    inputRef?: React.RefObject<HTMLInputElement | null>,
  ) => void;
  handleKeydown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => void;
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resultData: SearchDataItem[] | undefined;
  searchCityWithName: (city: string) => Promise<void>;
  shouldSearchSkeleton: boolean;
}
