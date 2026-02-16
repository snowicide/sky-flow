import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchSection from "./SearchSection";
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { useSearchStore } from "@/stores/useSearchStore";
import { favoriteStore, recentStore } from "@/hooks/useSearchHistory";
import type { HistoryItem } from "./SearchHistory.types";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/image", () => ({
  default: (props: Partial<React.ImgHTMLAttributes<HTMLImageElement>>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt}
      src={props.src}
      width={props.width || 5}
      height={props.height || 5}
    />
  ),
}));

const mockFetchWeatherData = vi.hoisted(() => vi.fn());
vi.mock("@/services/fetchWeatherData", () => ({
  fetchWeatherData: mockFetchWeatherData,
}));

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithClient = (element: React.ReactElement) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
  return render(element, { wrapper });
};

//
describe("SearchSection integration", () => {
  let user: ReturnType<typeof userEvent.setup>;
  let mockData: HistoryItem[];

  beforeEach(() => {
    window.localStorage.clear();
    recentStore.reset();
    favoriteStore.reset();

    testQueryClient.clear();
    vi.clearAllMocks();
    mockFetchWeatherData.mockClear();
    mockPush.mockClear();

    mockFetchWeatherData.mockResolvedValue({
      current: {
        city: "Berlin",
        country: "Germany",
      },
      daily: {
        temperature_2m_max: [-2],
      },
      hourly: {
        temperature_2m: [-2],
      },
    });

    user = userEvent.setup();

    mockData = [
      {
        id: "warsaw-poland",
        city: "Warsaw",
        country: "Poland",
        isFavorite: false,
        timestamp: 1,
      },
      {
        id: "berlin-germany",
        city: "Berlin",
        country: "Germany",
        isFavorite: false,
        timestamp: 2,
      },
      {
        id: "minsk-belarus",
        city: "Minsk",
        country: "Belarus",
        isFavorite: false,
        timestamp: 3,
      },
    ];
  });

  it("should update URL with city name", async () => {
    renderWithClient(<SearchSection />);
    const input = screen.getByPlaceholderText("Search for a place...");

    const { result } = renderHook(() => useSearchStore());
    act(() => result.current.reset());

    await user.type(input, "Berlin{enter}");
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("city=berlin"),
      ),
    );
  });

  it("should navigate from recent list", async () => {
    window.localStorage.setItem("weather-recent", JSON.stringify(mockData));
    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection />);
    const input = screen.getByPlaceholderText(/search for a place/i);
    await user.click(input);

    const cityOption = await screen.findByRole("option", {
      name: "Berlin, Germany",
    });
    const cityLink = within(cityOption).getByRole("button", {
      name: "Select Berlin",
    });
    await user.click(cityLink);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("city=berlin"),
      ),
    );
  });

  it("should navigate from featured list", async () => {
    window.localStorage.setItem("weather-favorite", JSON.stringify(mockData));
    act(() => {
      favoriteStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection />);
    await waitFor(() => useSearchStore.setState({ isOpen: true }));

    const featuredTab = await screen.findByRole("tab", {
      name: /featured searches/i,
    });
    await user.click(featuredTab);
    expect(useSearchStore.getState().currentTab).toBe("featured");

    const cityOption = await screen.findByRole("option", {
      name: "Berlin, Germany",
    });
    const cityLink = within(cityOption).getByLabelText("Select Berlin");
    await user.click(cityLink);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("city=berlin"),
      ),
    );
  });

  it("should toggle favorites in recent tab", async () => {
    window.localStorage.setItem("weather-recent", JSON.stringify(mockData));
    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection />);
    await waitFor(() => useSearchStore.setState({ isOpen: true }));

    const cityOption = screen.getByRole("option", { name: "Berlin, Germany" });
    const favoriteIcon = within(cityOption).getByLabelText(/toggle favorite/i);

    await user.click(favoriteIcon);
    await waitFor(() => {
      const currentFavorite = favoriteStore.getSnapshot();
      expect(currentFavorite.length).toBe(1);
      expect(currentFavorite[0].isFavorite).toBe(true);

      const hasCity = currentFavorite.some((item) => /berlin/i.test(item.city));
      expect(hasCity).toBe(true);
    });

    await user.click(favoriteIcon);
    await waitFor(() => {
      const currentFavorite = favoriteStore.getSnapshot();
      expect(currentFavorite.length).toBe(0);

      const hasCity = currentFavorite.some((item) => /berlin/i.test(item.city));
      expect(hasCity).toBe(false);
    });
  });

  it("should remove city from recent", async () => {
    window.localStorage.setItem("weather-recent", JSON.stringify(mockData));
    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection />);
    await waitFor(() => useSearchStore.setState({ isOpen: true }));

    const cityOption = screen.getByRole("option", { name: "Berlin, Germany" });
    const removeCity =
      within(cityOption).getByLabelText(/remove from history/i);

    await user.click(removeCity);

    await waitFor(() => {
      const currentRecent = recentStore.getSnapshot();
      expect(currentRecent.length).toBe(2);
      const hasCity = currentRecent.some((item) => /berlin/i.test(item.city));
      expect(hasCity).toBe(false);
      expect(screen.queryByText("Berlin, Germany")).not.toBeInTheDocument();
    });
  });

  it("should remove city from featured", async () => {
    window.localStorage.setItem("weather-favorite", JSON.stringify(mockData));
    act(() => {
      favoriteStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection />);
    await waitFor(() =>
      useSearchStore.setState({ isOpen: true, currentTab: "featured" }),
    );

    const cityOption = screen.getByRole("option", { name: "Berlin, Germany" });
    const favoriteIcon =
      within(cityOption).getByLabelText(/remove from featured/i);

    await user.click(favoriteIcon);
    await waitFor(() => {
      const currentFavorites = favoriteStore.getSnapshot();
      expect(currentFavorites.length).toBe(2);

      const hasCity = currentFavorites.some((item) =>
        /berlin/i.test(item.city),
      );
      expect(hasCity).toBe(false);
    });
  });
});
