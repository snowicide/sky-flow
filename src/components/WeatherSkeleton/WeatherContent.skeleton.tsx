import DailyForecastSkeleton from "./DailyForecast.skeleton";
import HourlyForecastSkeleton from "./HourlyForecast.skeleton";
import TodayWeatherSkeleton from "./TodayWeather.skeleton";
import WeatherDetailsSkeleton from "./WeatherDetails.skeleton";

export default function WeatherContentSkeleton() {
  return (
    <>
      <div className="flex flex-col items-center lg:items-start justify-center lg:flex-row gap-8">
        <div className="flex-1 w-full xl:max-w-200">
          <TodayWeatherSkeleton />
          <WeatherDetailsSkeleton />
          <DailyForecastSkeleton />
        </div>

        <HourlyForecastSkeleton />
      </div>
    </>
  );
}
