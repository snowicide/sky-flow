import Header from "@/components/Header";
import { SearchSection } from "@/components/SearchSection";
import { Metadata } from "next";
import { fetchWeatherData } from "@/services/fetchWeatherData";
import WeatherContent from "@/components/WeatherContent";
import { redirect } from "next/navigation";

interface WeatherPageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function WeatherPage({ searchParams }: WeatherPageProps) {
  const params = await searchParams;
  if (!params.city) redirect("/?city=minsk");

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
  searchParams: Promise<{ city?: string }>;
}): Promise<Metadata> {
  try {
    const { city } = await searchParams;
    if (!city) return { title: "Weather" };
    const initialData = await fetchWeatherData(city);
    const cityName = initialData.success
      ? initialData.validatedCity
      : "Not found";

    return { title: `Weather - ${cityName}` };
  } catch {
    return { title: "Weather" };
  }
}
