import type { AppError } from "@/types/errors";

export interface SearchBarProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  error: AppError | null;
}
