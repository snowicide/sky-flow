import { isFoundCity, type CityData } from "@/entities/location";

export const mapCityToUrlParams = (cityData: CityData): URLSearchParams => {
  const params = new URLSearchParams();
  params.set("city", cityData.city);

  if (isFoundCity(cityData)) {
    const { country, lat, lon, region, code } = cityData;

    if (region) params.set("region", region);
    if (country) params.set("country", country);
    if (code) params.set("code", code);
    params.set("lat", lat.toString());
    params.set("lon", lon.toString());
  }

  return params;
};
