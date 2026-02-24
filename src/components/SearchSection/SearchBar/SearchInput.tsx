import { ComponentPropsWithoutRef, forwardRef } from "react";
import { useShallow } from "zustand/shallow";

import { useSearchActions } from "@/hooks/useSearchActions";
import { useSearchStore } from "@/stores/useSearchStore";

export const SearchInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>((props, ref) => {
  const { setIsOpen, inputValue } = useSearchStore(
    useShallow((state) => ({
      setIsOpen: state.setIsOpen,
      inputValue: state.inputValue,
    })),
  );

  const { handleKeydown, handleChangeInput } = useSearchActions();

  return (
    <input
      {...props}
      ref={ref}
      aria-label="Search"
      value={inputValue}
      onKeyDown={(e) =>
        handleKeydown(e, ref as React.RefObject<HTMLInputElement>)
      }
      onChange={(e) => handleChangeInput(e)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setTimeout(() => setIsOpen(false), 1)}
      className="flex-1 min-w-0 bg-transparent placeholder-white/70 text-base sm:text-lg outline-none"
    />
  );
});
SearchInput.displayName = "SearchInput";
