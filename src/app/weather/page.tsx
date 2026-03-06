import { Metadata } from "next";

import { HeaderSection } from "@/components/HeaderSection";
import { SearchSection } from "@/components/SearchSection";
import { WeatherContent } from "@/components/WeatherContent";

import { findCityDataFromParams, redirectToDefaultCity } from "./utils";

export default async function WeatherPage({ searchParams }: WeatherPageProps) {
  const params = await searchParams;

  redirectToDefaultCity(params);
  const cityData = findCityDataFromParams(params);

  return (
    <>
      <HeaderSection />

      <main className="min-h-screen min-w-62.5 px-4 py-8 md:px-6 lg:px-8 mx-auto">
        <SearchSection cityData={cityData} />
        <WeatherContent cityData={cityData} />
      </main>
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string;
    country?: string;
    lat?: string;
    lon?: string;
  }>;
}): Promise<Metadata> {
  try {
    const { city, country, lat, lon } = await searchParams;
    if (!city) return { title: "SkyFlow" };

    if (city && (!lat || !lon || !country))
      return { title: "SkyFlow - Not found" };

    return { title: `SkyFlow - ${city}` };
  } catch {
    return { title: "SkyFlow" };
  }
}

interface WeatherPageProps {
  searchParams: Promise<{
    city?: string;
    country?: string;
    lat?: string;
    lon?: string;
  }>;
}
