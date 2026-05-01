import { useCompletion } from "@ai-sdk/react";
import { useCallback, useMemo, useState } from "react";
import type { RequestData } from "./types";

export function useAiDescription(aiRequestData: RequestData | null): AiReturn {
  const [selectedTab, setSelectedTab] = useState<"weather" | "location" | null>(
    null,
  );

  const { completion, complete, isLoading, error, stop } = useCompletion({
    api: "/api/ai",
  });

  const handleTabSelect = useCallback(
    async (tab: "weather" | "location") => {
      if (!aiRequestData) return;
      stop();
      setSelectedTab(tab);

      await complete("", { body: { ...aiRequestData, option: tab } });
    },
    [aiRequestData, stop, complete],
  );

  return useMemo(
    () => ({
      selectedTab,
      handleTabSelect,
      setSelectedTab,
      completion,
      isLoading,
      error,
    }),
    [
      selectedTab,
      handleTabSelect,
      setSelectedTab,
      completion,
      isLoading,
      error,
    ],
  );
}

interface AiReturn {
  selectedTab: "weather" | "location" | null;
  handleTabSelect: (tab: "weather" | "location") => void;
  setSelectedTab: React.Dispatch<
    React.SetStateAction<"weather" | "location" | null>
  >;
  completion: string;
  isLoading: boolean;
  error: Error | undefined;
}
