import { redirect } from "next/navigation";

import type { CityData } from "@/types/location";

export function redirectToDefaultCity(params: WeatherParams): void {
  const { city, country, lat, lon } = params;

  if (!city && !country && !lat && !lon)
    redirect("weather/?city=Minsk&country=Belarus&lat=53.9&lon=27.56667");
}

export function findCityDataFromParams(params: WeatherParams): CityData {
  const {
    city: cityParam,
    country: countryParam,
    lat: latParam,
    lon: lonParam,
  } = params;

  const city = cityParam || "Minsk";
  const hasValidParams = latParam && lonParam && countryParam;

  if (hasValidParams) {
    const lat = +latParam;
    const lon = +lonParam;

    if (!isNaN(lat) && !isNaN(lon))
      return {
        status: "found",
        city,
        country: countryParam,
        lat,
        lon,
      };
  }
  return { status: "not-found", city };
}

interface WeatherParams {
  city?: string | undefined;
  country?: string | undefined;
  lat?: string | undefined;
  lon?: string | undefined;
}
