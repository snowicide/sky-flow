import { renderHook, waitFor } from "@testing-library/react";
import { useSearchQuery } from "./useSearchQuery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppError } from "@/types/errors";

const mockFetchSearchResults = vi.hoisted(() => vi.fn());
vi.mock("@/services/fetchSearchResults", () => ({
  fetchSearchResults: mockFetchSearchResults,
}));

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, retryDelay: 0, gcTime: 0, staleTime: 0 },
  },
});

function renderHookWithClient<T>(hook: () => T) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
  return renderHook(hook, { wrapper });
}

describe("useSearchQuery", () => {
  let searchResult: string;
  let mockSearchResults: {
    city: string;
    country: string;
    id: number;
    latitude: number;
    longitude: number;
    temperature: number;
  }[];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchSearchResults.mockClear();
    testQueryClient.clear();

    searchResult = "Berlin";

    mockSearchResults = [
      {
        city: "Berlin",
        country: "Germany",
        id: 123,
        latitude: 10,
        longitude: 20,
        temperature: -2,
      },
    ];
  });

  it("should fetch data", async () => {
    mockFetchSearchResults.mockResolvedValue(mockSearchResults);
    const { result } = renderHookWithClient(() => useSearchQuery(searchResult));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockSearchResults);
  });

  it("shouldn't retry when not found or aborted", async () => {
    const notFoundError = new AppError(
      "GEOCODING_FAILED",
      `City ${searchResult} not found...`,
    );
    mockFetchSearchResults.mockRejectedValue(notFoundError);
    const { result } = renderHookWithClient(() => useSearchQuery(searchResult));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(notFoundError);

    expect((result.current.error as AppError).code).toBe("GEOCODING_FAILED");
    expect((result.current.error as AppError).message).toBe(
      `City ${searchResult} not found...`,
    );

    expect(result.current.failureCount).toBe(1);
    expect(mockFetchSearchResults).toHaveBeenCalledTimes(1);
  });
});
