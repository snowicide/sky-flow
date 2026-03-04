export type CityData =
  | {
      status: "found";
      city: string;
      country: string;
      lat: number;
      lon: number;
    }
  | {
      status: "not-found";
      city: string;
    };

export const isFoundCity = (
  cityData: CityData,
): cityData is Extract<CityData, { status: "found" }> =>
  cityData.status === "found";

export const isNotFoundCity = (
  cityData: CityData,
): cityData is Extract<CityData, { status: "not-found" }> =>
  cityData.status === "not-found";
