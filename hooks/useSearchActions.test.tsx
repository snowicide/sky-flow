import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSearchActions } from "./useSearchActions";
import { useSearchStore } from "@/stores/useSearchStore";
import { SearchInput } from "@/components/SearchSection/SearchBar";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

const mockAddCity = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/useSearchHistory", () => ({
  useSearchHistory: () => ({
    addCity: mockAddCity,
    recent: [],
    favorites: [],
    toggleFavorites: vi.fn(),
    removeCity: vi.fn(),
  }),
}));

const mockFetchWeatherData = vi.hoisted(() => vi.fn());
vi.mock("@/services/fetchWeatherData", () => ({
  fetchWeatherData: mockFetchWeatherData,
}));

const testQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

function renderHookWithClient<T>(hook: () => T) {
  const queryClient = testQueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(hook, { wrapper });
}

function renderWithClient(element: React.ReactElement) {
  const queryClient = testQueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return render(element, { wrapper });
}

describe("useSearchActions", () => {
  let inputElement: HTMLElement;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddCity.mockClear();

    renderWithClient(<SearchInput />);
    inputElement = screen.getByRole("textbox", { name: /search/i });
    user = userEvent.setup();

    act(() => {
      useSearchStore.getState().reset();
    });
  });

  it("should open dropdown and handling value", async () => {
    await user.click(inputElement);
    expect(inputElement).toHaveFocus();
    await waitFor(() => expect(useSearchStore.getState().isOpen).toBe(true));

    await user.type(inputElement, "Berlin");
    expect(useSearchStore.getState().inputValue).toBe("Berlin");
  });

  it("should change active tab", () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    act(() => result.current.handleChangeTab("favorites"));
    expect(useSearchStore.getState().currentTab).toBe("favorites");

    act(() => result.current.handleChangeTab("recent"));
    expect(useSearchStore.getState().currentTab).toBe("recent");
  });

  it("should handling keydown", () => {
    const { result } = renderHookWithClient(() => useSearchActions());
    const mockRef = { current: inputElement as HTMLInputElement };

    const enterEvent = {
      key: "Enter",
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    const escapeEvent = {
      key: "Escape",
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;
    inputElement.focus();

    act(() => useSearchStore.getState().setInputValue("Berlin"));
    expect(useSearchStore.getState().inputValue).toBe("Berlin");

    act(() => result.current.handleKeydown(escapeEvent, mockRef));
    expect(useSearchStore.getState().inputValue).toBe("Berlin");
    expect(document.activeElement).not.toBe(inputElement);

    inputElement.focus();

    act(() => result.current.handleKeydown(enterEvent, mockRef));
    expect(useSearchStore.getState().inputValue).toBe("");
    expect(document.activeElement).not.toBe(inputElement);
  });

  it("should change URL", () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    act(() => result.current.searchSelectedCity("Berlin"));

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("city=berlin"),
    );

    act(() => result.current.searchSelectedCity("NonExist123"));

    expect(mockPush).toHaveBeenCalledTimes(2);
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("city=nonexist123"),
    );

    expect(mockFetchWeatherData).not.toHaveBeenCalled();
    expect(mockAddCity).not.toHaveBeenCalled();
    expect(useSearchStore.getState().inputValue).toBe("");
  });

  it("shouldn't navigate when input is empty", () => {
    const { result } = renderHookWithClient(() => useSearchActions());

    act(() => result.current.searchSelectedCity(""));
    expect(mockPush).not.toHaveBeenCalled();
  });
});
