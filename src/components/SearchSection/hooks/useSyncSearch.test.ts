import { renderHook } from "@testing-library/react";

import { useSearchStore } from "@/stores/useSearchStore";

import { useSyncSearch } from "./useSyncSearch";

const mockAddCity = vi.fn();
vi.mock("@/components/SearchSection/hooks/useSearchHistory", () => ({
  useSearchHistory: vi.fn(() => ({
    addCity: mockAddCity,
  })),
}));

describe("useSyncSearch", () => {
  const mockCity = {
    city: "Minsk",
    country: "Belarus",
    lat: 53.9,
    lon: 27.56667,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useSearchStore.setState({ _hasHydrated: false, setIsOpen: vi.fn() });
  });

  it("shouldn't call addCity if hydrated false", () => {
    renderHook(() => useSyncSearch(mockCity));

    expect(mockAddCity).not.toHaveBeenCalled();
  });

  it("should call addCity 1 time after hydration", () => {
    const setIsOpen = useSearchStore.getState().setIsOpen;

    const { rerender } = renderHook(({ city }) => useSyncSearch(city), {
      initialProps: { city: mockCity },
    });

    useSearchStore.setState({ _hasHydrated: true });
    rerender({ city: mockCity });

    expect(mockAddCity).toHaveBeenCalledTimes(1);
    expect(mockAddCity).toHaveBeenCalledWith(mockCity);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
