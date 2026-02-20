import { Header } from "@/components/Header";
import { SearchSection } from "@/components/SearchSection";
import { Metadata } from "next";
import { WeatherContent } from "@/components/WeatherContent";
import { redirect } from "next/navigation";
import { fetchGeoData } from "@/services/fetchGeoData";

interface WeatherPageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function WeatherPage({ searchParams }: WeatherPageProps) {
  const params = await searchParams;
  if (!params.city)
    redirect("/?city=Minsk&lat=53.9&lon=27.56667&country=Belarus");

  return (
    <>
      <Header />

      <main className="min-h-screen min-w-62.5 px-4 py-8 md:px-6 lg:px-8 mx-auto">
        <SearchSection />
        <WeatherContent params={params} />
      </main>
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; lat?: string; lon?: string }>;
}): Promise<Metadata> {
  try {
    const { city, lat, lon } = await searchParams;
    if (!city) return { title: "SkyFlow" };
    const data = await fetchGeoData(city);
    const targetCity = data.results.find(
      (item) => item.latitude === Number(lat) && item.longitude === Number(lon),
    );
    const cityName = targetCity ? targetCity.name : "Not found";

    return { title: `SkyFlow - ${cityName}` };
  } catch {
    return { title: "SkyFlow" };
  }
}
