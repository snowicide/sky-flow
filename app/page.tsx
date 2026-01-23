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

      <main className="flex flex-col w-full items-center px-4 mt-15">
        {/* title */}
        <h1 className="text-[54px] md:text-[3rem] font-bold text-center max-w-75 md:max-w-full leading-15">
          How&apos;s the sky looking today?
        </h1>
        {/* search */}
        <div className="flex flex-col md:mt-14 md:gap-4 md:flex-row justify-center w-full">
          <div className="flex items-center w-full max-w-125 bg-[hsl(243,27%,20%)] mt-14 md:mt-0 rounded-xl">
            <button className="pl-5">
              <Image src={searchIcon} className="w-6" alt="Search Icon" />
            </button>
            <input
              className="ml-2 py-3.25 w-full px-2 placeholder-white/80 text-xl"
              placeholder="Search for a place..."
            />
          </div>

          <button className="bg-[hsl(233,67%,56%)] py-3.25 px-6 mt-3 md:mt-0 tracking-wide text-xl md:text-lg rounded-xl">
            Search
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col self-start">
            {/* todays weather */}
            <div className="relative flex w-full flex-col md:flex-row md:max-w-155 gap-2 items-center mt-8 md:mt-24">
              <Image
                src={bgTodayMobile}
                className="absolute -z-1 inline-block md:hidden"
                alt="Today"
              />
              <Image
                src={bgTodayDesktop}
                className="absolute -z-1 hidden md:inline-block"
                alt="Today"
              />
              <div className="md:flex md:w-full md:items-center md:justify-between md:px-8">
                <div className="flex flex-col md:gap-2 items-center md:items-start">
                  <div className="text-3xl md:text-2xl font-semibold mt-12 md:mt-0 md:whitespace-nowrap">
                    Berlin, Germany
                  </div>
                  <div className="text-white/70 text-[1.25rem] md:text-[1rem] md:whitespace-nowrap">
                    Tuesday, Aug 5, 2025
                  </div>
                </div>
                <div className="flex items-center">
                  <Image src={sunnyIcon} className="w-30 mr-2" alt="Sunny" />
                  <div className="text-8xl font-bold flex gap-3">
                    <span className="italic">20</span>
                    <span>°</span>
                  </div>
                </div>
              </div>
            </div>
            {/* weather details */}
            <div className="grid grid-cols-2 md:flex gap-x-5 md:gap-3.5 gap-y-5 mt-14 md:mt-20">
              {weatherDetails.map(({ title, value }, index) => (
                <div
                  key={`${title}-${index}`}
                  className="flex flex-col justify-between w-40 md:w-36.25 h-30 pl-5 py-4 bg-[hsl(243,27%,20%)] rounded-xl border border-[hsl(250,6%,84%)]/10"
                >
                  <span className="text-lg text-white/70">{title}</span>
                  <span className="text-3xl">{value}</span>
                </div>
              ))}
            </div>
            {/* dayly forecast */}
            <h1 className="self-start text-2xl mt-8">Daily forecast</h1>
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 mt-5 w-full">
              {weekDailyForecast.map(
                ({ day, image, temp, feelsLike }, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="flex flex-col justify-between py-3 w-25 h-40 items-center bg-[hsl(243,27%,20%)] rounded-xl border border-[hsl(250,6%,84%)]/10"
                  >
                    <span>{day}</span>
                    <Image src={image} className="w-15" alt="Weather Icon" />
                    <div className="flex justify-between w-full px-3">
                      <span>{temp}</span>
                      <span className="text-white/70">{feelsLike}</span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
          {/* hourly forecast */}
          <div className="flex flex-col md:h-178 gap-4 w-full md:w-60 px-4 py-4 my-8 bg-[hsl(243,27%,20%)] rounded-2xl border border-[hsl(250,6%,84%)]/10">
            <div className="flex justify-between items-center">
              <div className="text-xl">Hourly forecast</div>
              <button className="flex items-center px-4 py-1.5 gap-3 bg-[hsl(243,23%,30%)] rounded-lg border border-[hsl(250,6%,84%)]/10">
                <span>Tuesday</span>
                <Image src={dropdownIcon} alt="Dropdown" />
              </button>
            </div>
            {/* map each hour */}
            {hourlyForecast.map(({ image, hour, temp }, index) => (
              <div
                key={`${hour}-${index}`}
                className="flex justify-between h-15 items-center px-2 bg-[hsl(243,23%,24%)]/90 rounded-lg border border-[hsl(250,6%,84%)]/10"
              >
                <div className="flex items-center gap-1">
                  <Image src={image} className="w-10" alt="Weather Icon" />
                  <span className="text-lg">{hour}</span>
                </div>
                <div className="mr-2">{temp}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
