import Header from "@/components/Header";
import Image from "next/image";
import searchIcon from "@/public/icons/icon-search.svg";
import bgTodayMobile from "@/public/images/bg-today-small.svg";
import bgTodayDesktop from "@/public/images/bg-today-large.svg";
import dropdownIcon from "@/public/icons/icon-dropdown.svg";

import sunnyIcon from "@/public/icons/icon-sunny.webp";
import rainIcon from "@/public/icons/icon-rain.webp";
import drizzleIcon from "@/public/icons/icon-drizzle.webp";
import partlyCloudyIcon from "@/public/icons/icon-partly-cloudy.webp";
import stormIcon from "@/public/icons/icon-storm.webp";
import snowIcon from "@/public/icons/icon-snow.webp";
import fogIcon from "@/public/icons/icon-fog.webp";
import overcastIcon from "@/public/icons/icon-overcast.webp";

export default function Home() {
  const weatherDetails = [
    {
      title: "Feels Like",
      value: "18°",
    },
    {
      title: "Humidity",
      value: "46%",
    },
    {
      title: "Wind",
      value: "14 km/h",
    },
    {
      title: "Pricipitation",
      value: "0 mm",
    },
  ];

  const weekDailyForecast = [
    {
      day: "Tue",
      image: rainIcon,
      temp: "20°",
      feelsLike: "14°",
    },
    {
      day: "Wed",
      image: drizzleIcon,
      temp: "21°",
      feelsLike: "15°",
    },
    {
      day: "Thu",
      image: sunnyIcon,
      temp: "24°",
      feelsLike: "14°",
    },
    {
      day: "Fri",
      image: partlyCloudyIcon,
      temp: "25°",
      feelsLike: "13°",
    },
    {
      day: "Sat",
      image: stormIcon,
      temp: "21°",
      feelsLike: "15°",
    },
    {
      day: "Sun",
      image: snowIcon,
      temp: "25°",
      feelsLike: "16°",
    },
    {
      day: "Mon",
      image: fogIcon,
      temp: "24°",
      feelsLike: "15°",
    },
  ];

  const hourlyForecast = [
    {
      image: overcastIcon,
      hour: "3 PM",
      temp: "20°",
    },
    {
      image: partlyCloudyIcon,
      hour: "4 PM",
      temp: "20°",
    },
    {
      image: sunnyIcon,
      hour: "5 PM",
      temp: "20°",
    },
    {
      image: overcastIcon,
      hour: "6 PM",
      temp: "19°",
    },
    {
      image: snowIcon,
      hour: "7 PM",
      temp: "18°",
    },
    {
      image: fogIcon,
      hour: "8 PM",
      temp: "18°",
    },
    {
      image: snowIcon,
      hour: "9 PM",
      temp: "17°",
    },
    {
      image: overcastIcon,
      hour: "10 PM",
      temp: "17°",
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen min-w-62.5 px-4 py-8 md:px-6 lg:px-8 mx-auto">
        {/* title & search */}
        <div className="mb-10">
          <h1 className="text-5xl max-w-80 sm:max-w-full leading-tight justify-self-center sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-10">
            How&apos;s the sky looking today?
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex items-center flex-1 bg-[hsl(243,27%,20%)] rounded-xl px-4 py-3">
              <Image src={searchIcon} className="w-5 h-5 mr-3" alt="Search" />
              <input
                className="flex-1 bg-transparent placeholder-white/70 text-base sm:text-lg outline-none"
                placeholder="Search for a place..."
              />
            </div>
            <button className="bg-[hsl(233,67%,56%)] text-white font-medium py-3 px-6 rounded-xl text-base sm:text-lg whitespace-nowrap hover:opacity-90 transition-opacity">
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center lg:flex-row gap-8">
          <div className="lg:flex-1 max-w-200">
            {/* todays weather */}
            <div className="relative rounded-2xl py-8 overflow-hidden mb-8">
              <div className="absolute inset-0">
                <Image
                  src={bgTodayMobile}
                  alt="Today background"
                  className="w-full h-full object-contain scale-1000 md:hidden"
                  fill
                  priority
                />
                <Image
                  src={bgTodayDesktop}
                  alt="Today background"
                  className="w-full h-full object-contain scale-1000 hidden md:block"
                  fill
                />
              </div>

              <div className="relative p-6 sm:p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                      Berlin, Germany
                    </h2>
                    <p className="text-white/70 text-lg sm:text-xl">
                      Tuesday, Aug 5, 2025
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 sm:w-35 sm:h-35">
                      <Image
                        src={sunnyIcon}
                        alt="Sunny"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="font-bold flex gap-3">
                      <span className="text-5xl sm:text-6xl md:text-8xl italic">
                        20
                      </span>
                      <span className="text-4xl sm:text-6xl">°</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* weather details */}
            <div className="mb-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {weatherDetails.map(({ title, value }) => (
                  <div
                    key={title}
                    className="bg-[hsl(243,27%,20%)] p-4 sm:p-5 rounded-xl border border-white/10"
                  >
                    <p className="text-white/70 text-sm sm:text mb-2">
                      {title}
                    </p>
                    <p className="text-2xl sm:text-2xl font-semibold">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* daily forecast */}
            <div className="mb-10">
              <h3 className="text-xl sm:text-2xl font-bold mb-5">
                Daily forecast
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                {weekDailyForecast.map(({ day, image, temp, feelsLike }) => (
                  <div
                    key={day}
                    className="bg-[hsl(243,27%,20%)] p-4 rounded-xl border border-white/10 flex flex-col items-center"
                  >
                    <p className="font-medium mb-3">{day}</p>
                    <div className="relative w-12 h-12 mb-3">
                      <Image
                        src={image}
                        alt={`${day} weather`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex justify-between w-full">
                      <span className="font-bold">{temp}</span>
                      <span className="text-white/70">{feelsLike}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* hourly forecast */}
          <div className="lg:w-96">
            <div className="bg-[hsl(243,27%,20%)] p-5 sm:p-6 rounded-2xl border border-white/10 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Hourly forecast</h3>
                <button className="flex items-center gap-2 bg-[hsl(243,23%,30%)] px-4 py-2 rounded-lg border border-white/10 hover:opacity-70 transition-opacity">
                  <span>Tuesday</span>
                  <Image
                    src={dropdownIcon}
                    alt="Dropdown"
                    className="w-4 h-4"
                  />
                </button>
              </div>

              <div className="space-y-3">
                {hourlyForecast.map(({ image, hour, temp }) => (
                  <div
                    key={hour}
                    className="flex items-center justify-between bg-[hsl(243,23%,24%)] hover:opacity-75 transition duration-75 p-3 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8">
                        <Image
                          src={image}
                          alt={`${hour} weather`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">{hour}</span>
                    </div>
                    <span className="text-xl font-bold">{temp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
