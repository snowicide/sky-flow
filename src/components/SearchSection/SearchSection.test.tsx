import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  favoriteStore,
  recentStore,
} from "@/components/SearchSection/hooks/useSearchHistory";
import { useSearchStore } from "@/stores/useSearchStore";
import { createCityDataMocks } from "@/testing/mocks/factories/cityData";
import { createHistoryCity } from "@/testing/mocks/factories/historyData";

import SearchSection from "./SearchSection";

// --- 1. mocks ---
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/image", async () => {
  const actual = await vi.importActual("@/testing/mocks/next/image");
  return { default: actual.default };
});

// --- 2. tests ---
describe("SearchSection integration", () => {
  let user: ReturnType<typeof userEvent.setup>;
  const historyData = createHistoryCity();
  const { berlinCityData } = createCityDataMocks();

  beforeEach(() => {
    window.localStorage.clear();
    recentStore.reset();
    favoriteStore.reset();
    testQueryClient.clear();
    vi.clearAllMocks();
    mockPush.mockClear();

    user = userEvent.setup();
  });

  it("should update URL with city name", async () => {
    renderWithClient(<SearchSection cityData={berlinCityData} />);
    const input = screen.getByPlaceholderText("Search for a place...");

    const { result } = renderHook(() => useSearchStore());
    act(() => result.current.reset());

    await user.type(input, "Berlin{enter}");
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        "/?city=Berlin&country=Germany&lat=52.52437&lon=13.41053",
      ),
    );
  });

  it("should navigate from recent list", async () => {
    window.localStorage.setItem("weather-recent", JSON.stringify(historyData));
    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection cityData={berlinCityData} />);
    const input = screen.getByPlaceholderText(/search for a place/i);
    await user.click(input);

    const cityOption = await screen.findByRole("option", {
      name: "Berlin, Germany",
    });
    const cityLink = within(cityOption).getByRole("button", {
      name: "Select Berlin, Germany",
    });
    await user.click(cityLink);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(
          "city=Berlin&country=Germany&lat=52.52437&lon=13.41053",
        ),
      ),
    );
  });

  it("should navigate from favorites list", async () => {
    window.localStorage.setItem(
      "weather-favorite",
      JSON.stringify(historyData),
    );
    act(() => {
      favoriteStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection cityData={berlinCityData} />);
    await waitFor(() => useSearchStore.setState({ isOpen: true }));

    const favoritesTab = await screen.findByRole("tab", {
      name: /favorites searches/i,
    });
    await user.click(favoritesTab);
    expect(useSearchStore.getState().currentTab).toBe("favorites");

    const cityOption = await screen.findByRole("option", {
      name: "Berlin, Germany",
    });
    const cityLink = within(cityOption).getByLabelText(
      "Select Berlin, Germany",
    );
    await user.click(cityLink);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(
          "city=Berlin&country=Germany&lat=52.52437&lon=13.41053",
        ),
      ),
    );
  });

  it("should toggle favorites in recent tab", async () => {
    window.localStorage.setItem("weather-recent", JSON.stringify(historyData));
    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection cityData={berlinCityData} />);
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
    window.localStorage.setItem("weather-recent", JSON.stringify(historyData));
    act(() => {
      recentStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection cityData={berlinCityData} />);
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

  it("should remove city from favorites", async () => {
    window.localStorage.setItem(
      "weather-favorite",
      JSON.stringify(historyData),
    );
    act(() => {
      favoriteStore.reset();
      useSearchStore.getState().reset();
    });
    renderWithClient(<SearchSection cityData={berlinCityData} />);
    await waitFor(() =>
      useSearchStore.setState({ isOpen: true, currentTab: "favorites" }),
    );

    const cityOption = screen.getByRole("option", { name: "Berlin, Germany" });
    const favoriteIcon = within(cityOption).getByLabelText(
      /remove from favorites/i,
    );

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

// --- 3. render with client
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
