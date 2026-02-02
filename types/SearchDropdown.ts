export interface SearchDropdownProps {
  inputValue: string;
  setInputValue: (value: string) => void;
}

export interface SearchTabProps {
  handleOptionSelect: (value: string) => void;
  index: number;
  featuredSearches?: cityObject[];
  city: cityObject;
}

interface cityObject {
  name: string;
  value: string;
}

export type ActiveTab = "recent" | "featured";
