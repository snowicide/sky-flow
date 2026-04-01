import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";

// --- 1. mocks ---
vi.mock("@/entities/location", async () => {
  const actual = await vi.importActual("@/entities/location");
  return { ...actual, useSearchQuery: vi.fn() };
});

import { useSearchStore } from "@/entities/location";
import { useSearchQuery } from "@/entities/location";

import { useSearchCity } from "../useSearchCity";

// --- 2. setup ---
const setup = () => {
  const { result, rerender } = renderHookWithClient(() => useSearchCity());
  const mockQuery = vi.mocked(useSearchQuery);

  const timer = async (ms: number = 500) =>
    await act(async () => await vi.advanceTimersByTimeAsync(ms));

  return {
    result,
    rerender,
    mockQuery,
    timer,
    store: useSearchStore.getState(),
  };
};

// --- 3. tests ---
describe("useSearchCity", () => {
  type QueryReturn = ReturnType<typeof useSearchQuery>;

  beforeEach(() => {
    vi.useFakeTimers();
    useSearchStore.getState().reset();
    vi.mocked(useSearchQuery).mockReturnValue({
      data: undefined,
      isFetching: false,
    } as ReturnType<typeof useSearchQuery>);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shouldn't show skeleton when input is empty", () => {
    const { result, store } = setup();

    act(() => store.setInputValue(""));
    expect(result.current.shouldSearchSkeleton).toBe(false);
  });

  it("should show skeleton when typing", () => {
    const { result, store } = setup();

    act(() => store.setInputValue("Berlin"));
    expect(result.current.shouldSearchSkeleton).toBe(true);
  });

  it("should handle debounce and hide skeleton after delay", async () => {
    const { result, store, timer } = setup();

    act(() => store.setInputValue("Berlin"));
    expect(result.current.shouldSearchSkeleton).toBe(true);

    await timer();
    expect(result.current.shouldSearchSkeleton).toBe(false);
  });

  it("should show skeleton while fetching", async () => {
    const { result, mockQuery, store, timer } = setup();
    mockQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
    } as QueryReturn);

    act(() => store.setInputValue("Berlin"));
    expect(result.current.shouldSearchSkeleton).toBe(true);

    await timer();
    expect(result.current.shouldSearchSkeleton).toBe(true);
  });

  it("should hide skeleton after success data", async () => {
    const { result, rerender, mockQuery, store, timer } = setup();
    mockQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
    } as QueryReturn);

    act(() => store.setInputValue("Berlin"));
    await timer();
    expect(result.current.shouldSearchSkeleton).toBe(true);

    mockQuery.mockReturnValue({
      data: [{ city: "Berlin" }],
      isFetching: false,
    } as QueryReturn);
    rerender();

    expect(result.current.shouldSearchSkeleton).toBe(false);
  });
});

// --- 4. render with client ---
function renderHookWithClient<T>(hook: () => T) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return renderHook(hook, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}
