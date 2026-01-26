import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import TodayWeather from "@/components/TodayWeather";
import WeatherDetails from "@/components/WeatherDetails";
import DailyForecast from "@/components/DailyForecast";
import HourlyForecast from "@/components/HourlyForecast";
import { searchWeather } from "./actions";
import StoreInitializer from "./providers/StoreInitializer";

export default async function Home() {
  const initialData = await searchWeather("Minsk");
  const weatherData = initialData.success ? initialData.data : null;

  return (
    <>
      <Header />
      {<StoreInitializer initialData={weatherData} city="Minsk" />}

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
