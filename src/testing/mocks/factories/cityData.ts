import { type CityData } from "@/types/location";

export const createCityData = (
  overrides: CityDataOverrides = {},
): CityDataMocks => {
  const getCity = (
    data: CityData,
    override: Partial<CityData> = {},
  ): CityData => {
    if (override?.status === "not-found" || data.status === "not-found")
      return { status: "not-found", city: data.city };
    return { ...data, ...override };
  };

  return {
    minskCityData: getCity(getMinskData(), overrides.minsk),
    berlinCityData: getCity(getBerlinData(), overrides.berlin),
    warsawCityData: getCity(getWarsawData(), overrides.warsaw),
  };
};

const createBaseCityData = (
  city: string,
  country: string,
  lat: number,
  lon: number,
): CityData => ({
  status: "found",
  city,
  country,
  lat,
  lon,
});

const getMinskData = (): CityData =>
  createBaseCityData("Minsk", "Belarus", 53.9, 27.56667);

const getBerlinData = (): CityData =>
  createBaseCityData("Berlin", "Germany", 52.52437, 13.41053);

const getWarsawData = (): CityData =>
  createBaseCityData("Warsaw", "Poland", 52.22977, 21.01178);

interface CityDataOverrides {
  minsk?: Partial<CityData>;
  berlin?: Partial<CityData>;
  warsaw?: Partial<CityData>;
}

interface CityDataMocks {
  minskCityData: CityData;
  berlinCityData: CityData;
  warsawCityData: CityData;
}
