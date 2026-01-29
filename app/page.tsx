import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import TodayWeather from "@/components/TodayWeather";
import WeatherDetails from "@/components/WeatherDetails";
import DailyForecast from "@/components/DailyForecast";
import HourlyForecast from "@/components/HourlyForecast";
import StoreInitializer from "./providers/StoreInitializer";
import { Metadata } from "next";
import DynamicTitle from "./DynamicTitle";
import { fetchWeatherData } from "@/services/fetchWeatherData";

export default async function WeatherPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const targetCity = city?.trim() || "Minsk";
  const weatherData = await fetchWeatherData(targetCity);

  return (
    <>
      <DynamicTitle />
      <Header />
      {
        <StoreInitializer
          initialData={weatherData.success ? weatherData.data : null}
          city={targetCity}
        />
      }
      <main className="min-h-screen min-w-62.5 px-4 py-8 md:px-6 lg:px-8 mx-auto">
        <SearchSection />

        <div className="flex flex-col items-center lg:items-start justify-center lg:flex-row gap-8">
          <div className="flex-1 w-full xl:max-w-200">
            <TodayWeather />
            <WeatherDetails />
            <DailyForecast />
          </div>

          <HourlyForecast />
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}): Promise<Metadata> {
  const { city } = await searchParams;
  const initialData = await fetchWeatherData(city || "Not found");
  const cityName = initialData.success
    ? initialData.validatedCity
    : "Not found";

  return { title: `Weather - ${cityName}` };
}
