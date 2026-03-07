import type { SearchDataItem } from "@/components/SearchSection/types/SearchData";
import type {
  WeatherDataDaily,
  WeatherDataHourly,
} from "@/types/api/WeatherData";

// --- 1.1 weather data factories ---
export const createWeatherDataMocks = (
  overrides: WeatherOverrides = {},
): WeatherDataMocks => {
  return {
    dailyData: {
      ...getDailyData(),
      ...overrides.daily,
    } as WeatherDataDaily,

    hourlyData: {
      ...getHourlyData(),
      ...overrides.hourly,
    } as WeatherDataHourly,
  };
};

// --- 1.2 weather data items ---
const getDailyData = (): WeatherDataDaily => ({
  temperature_2m_min: Array.from({ length: 8 }, (_, i) => i),
  temperature_2m_max: Array.from({ length: 8 }, (_, i) => i + 2),
  apparent_temperature_min: Array.from({ length: 8 }, (_, i) => i),
  apparent_temperature_max: Array.from({ length: 8 }, (_, i) => i + 2),
  time: Array.from(
    { length: 8 },
    (_, i) => `2026-03-${(i + 1).toString().padStart(2, "0")}`,
  ),
  weather_code: Array.from({ length: 8 }, (_, i) => i),
});

const getHourlyData = (): WeatherDataHourly => ({
  temperature_2m: [
    ...Array.from({ length: 24 }, (_, i) => i),
    ...Array.from({ length: 24 }, (_, i) => i + 1),
  ],
  time: [
    ...Array.from(
      { length: 24 },
      (_, i) => `2026-03-01T${i.toString().padStart(2, "0")}:00Z`,
    ),
    ...Array.from(
      { length: 24 },
      (_, i) => `2026-03-02T${i.toString().padStart(2, "0")}:00Z`,
    ),
  ],
  weather_code: [...Array(24).fill(0), ...Array(24).fill(1)],
});

// --- 2.1 search results factories ---
export const createResultsMocks = (
  overrides: Partial<SearchDataItem> = {},
): SearchDataItem[] => {
  return [
    ...Array(7).fill({
      ...getFirstSearchResults(),
      ...overrides,
    }),

    {
      ...getLastSearchResults(),
      ...overrides,
    },
  ];
};

// --- 2.2 search results items ---
const getFirstSearchResults = (): SearchDataItem => ({
  city: "Berlin",
  country: "Germany",
  id: 2950159,
  latitude: 52.52437,
  longitude: 13.41053,
  temperature: 11.5,
  temperatureUnit: "°C",
  weatherCode: 3,
});

const getLastSearchResults = (): SearchDataItem => ({
  city: "East Berlin",
  country: "United States",
  id: 4557666,
  latitude: 39.9376,
  longitude: -76.97859,
  temperature: 11,
  temperatureUnit: "°C",
  weatherCode: 3,
});

interface WeatherOverrides {
  daily?: Partial<WeatherDataDaily>;
  hourly?: Partial<WeatherDataHourly>;
}

interface WeatherDataMocks {
  dailyData: WeatherDataDaily;
  hourlyData: WeatherDataHourly;
}
