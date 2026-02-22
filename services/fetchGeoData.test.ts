import { fetchGeoData } from "./fetchGeoData";

describe("fetchGeoData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch 8 cities with minsk query", async () => {
    const result = await fetchGeoData("Minsk");

    expect(result.results).toHaveLength(8);
    expect(result.results[0].name).toBe("Minsk");
    expect(result.results[0].country).toBe("Belarus");
  });

  it("should handle 404 error", async () => {
    await expect(fetchGeoData("nonExist123")).rejects.toThrow();
  });
});
