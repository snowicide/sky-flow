export interface SearchDropdownProps {
  inputValue: string;
  setInputValue: (value: string) => void;
}

export interface RecentTabProps {
  handleOptionSelect: (value: string) => void;
  name: string;
  value: string;
  index: number;
}

export type ActiveTab = "recent" | "featured";
