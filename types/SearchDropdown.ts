export interface SearchDropdownProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSearch: () => void;
}

export type ActiveTab = "recent" | "featured";
