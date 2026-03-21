import { verifyAndGetCityData, type WeatherParams } from "./utils";

// --- 1. mocks ---
const mockRedirect = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));

// --- 2. tests ---
describe("WeatherPage utils", () => {
  const params = {
    city: "London",
    region: "England",
    code: "PPLC",
    country: "United Kingdom",
    lat: "51.50853",
    lon: "-0.12574",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const cases = [
    {
      name: "no coords",
      params: {
        status: "found",
        city: "London",
        region: "England",
        code: "PPLC",
        country: "United Kingdom",
      },
      expected: {
        status: "found",
        city: "London",
        region: "England",
        code: "PPLC",
        country: "United Kingdom",
        lat: 51.50853,
        lon: -0.12574,
      },
    },
    {
      name: "no country",
      params: {
        status: "found",
        city: "London",
        region: "England",
        code: "PPLC",
        lat: "51.50853",
        lon: "-0.12574",
      },
      expected: {
        status: "found",
        city: "London",
        region: "England",
        code: "PPLC",
        country: "United Kingdom",
        lat: 51.50853,
        lon: -0.12574,
      },
    },
    {
      name: "no code",
      params: {
        status: "found",
        city: "London",
        region: "England",
        country: "United Kingdom",
        lat: "51.50853",
        lon: "-0.12574",
      },
      expected: {
        status: "found",
        city: "London",
        region: "England",
        code: "PPLC",
        country: "United Kingdom",
        lat: 51.50853,
        lon: -0.12574,
      },
    },
    {
      name: "only city",
      params: {
        status: "found",
        city: "London",
      },
      expected: {
        status: "found",
        city: "London",
        region: "England",
        code: "PPLC",
        country: "United Kingdom",
        lat: 51.50853,
        lon: -0.12574,
      },
    },
  ];

  test.each(cases)(
    "should redirect when $name",
    async ({ params, expected }) => {
      const result = await verifyAndGetCityData(params);
      expect(result).toEqual(expected);
    },
  );

  it("should redirect to default city when no params", async () => {
    await verifyAndGetCityData({ city: "" });
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("/weather/?city=Minsk"),
    );
  });

  it("should return city data when params valid", async () => {
    const result = await verifyAndGetCityData(params);

    expect(result).toEqual({
      ...params,
      status: "found",
      lat: 51.50853,
      lon: -0.12574,
    });
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should return not found when city doesn't exist", async () => {
    const params = { city: "nonExist12313" };
    const result = await verifyAndGetCityData(params);

    expect(result).toEqual({ status: "not-found", city: "nonExist12313" });
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("should redirect when extra params", async () => {
    await verifyAndGetCityData({
      ...params,
      extra: "123",
    } as WeatherParams);

    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("/weather/?city=London"),
    );
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.not.stringContaining("extra"),
    );
  });

  it("should redirect when params incorrect", async () => {
    await verifyAndGetCityData({
      ...params,
      region: "123",
      lat: "0",
      lon: "0",
    });

    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("/weather/?city=London"),
    );
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("region=England"),
    );
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("lat=51.50853"),
    );
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("lon=-0.12574"),
    );
  });
});
