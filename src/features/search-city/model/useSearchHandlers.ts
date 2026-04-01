import { RefObject, useCallback, useMemo } from "react";

import { type ActiveTab } from "@/entities/location";
import { useSearchState } from "@/entities/location/model/useSearchStore";

import { useSearchActions } from "./useSearchActions";

export function useSearchHandlers(): useSearchHandlersReturn {
  const { setInputValue, setCurrentTab, inputValue, setIsOpen } =
    useSearchState();
  const { searchCityWithName } = useSearchActions();

  const handleChangeTab = useCallback(
    (value: ActiveTab): void => {
      setCurrentTab(value);
    },
    [setCurrentTab],
  );

  const handleKeydown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      inputRef: RefObject<HTMLInputElement | null>,
    ): void => {
      if (e.key === "Enter") {
        searchCityWithName(inputValue);
        inputRef?.current?.blur();
        setIsOpen(false);
        setInputValue("");
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        if (inputRef.current) inputRef.current.blur();
      }
    },
    [inputValue, searchCityWithName, setIsOpen, setInputValue],
  );

  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setInputValue(e.target.value);
      setIsOpen(true);
    },
    [setIsOpen, setInputValue],
  );

  const handleSubmit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>): void => {
      e.preventDefault();
      searchCityWithName(inputValue);
    },
    [searchCityWithName, inputValue],
  );

  return useMemo(
    () => ({
      handleChangeTab,
      handleKeydown,
      handleChangeInput,
      handleSubmit,
    }),
    [handleChangeTab, handleKeydown, handleChangeInput, handleSubmit],
  );
}

interface useSearchHandlersReturn {
  handleChangeTab: (value: ActiveTab) => void;
  handleKeydown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    inputRef: RefObject<HTMLInputElement | null>,
  ) => void;
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}
