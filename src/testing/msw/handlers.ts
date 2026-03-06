import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://geocoding-api.open-meteo.com/v1/search", ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");

    if (!name) return HttpResponse.json({ results: [] }, { status: 200 });

    const cityKey = Object.keys(CITY_RESPONSES).find(
      (key) => key.toLowerCase() === name.toLowerCase(),
    );

    if (cityKey) return HttpResponse.json({ results: CITY_RESPONSES[cityKey] });

    return HttpResponse.json({ results: [] }, { status: 200 });
  }),

  http.get("https://api.open-meteo.com/v1/forecast", ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get("city");
    const country = url.searchParams.get("country");
    const latitudes = url.searchParams.get("latitude")?.split(",") ?? [];
    const longitudes = url.searchParams.get("longitude")?.split(",") ?? [];
    const count = Math.max(latitudes.length, 1);

    const forecasts = Array.from({ length: count }, (_, index) => ({
      current: {
        time: new Date().toISOString(),
        apparent_temperature: -2,
        city,
        country,
        interval: 10,
        precipitation: 0,
        relative_humidity_2m: 10,
        temperature_2m: -2,
        weather_code: 0,
        wind_speed_10m: 10,
        latitude: 53.9,
        longitude: 27.56667,
      },
      hourly: {
        temperature_2m: Array.from({ length: 24 }, () => -2),
        time: Array.from({ length: 24 }, () => new Date().toISOString()),
        weather_code: Array.from({ length: 24 }, () => 0),
      },
      daily: {
        apparent_temperature_max: Array.from({ length: 7 }, () => -2),
        apparent_temperature_min: Array.from({ length: 7 }, () => -4),
        temperature_2m_max: Array.from({ length: 7 }, () => -4),
        temperature_2m_min: Array.from({ length: 7 }, () => -2),
        time: Array.from(
          { length: 7 },
          () => new Date().toISOString().split("T")[0],
        ),
        weather_code: Array.from({ length: 7 }, () => 0),
      },
      current_units: {
        temperature_2m: "°C",
        apparent_temperature: "°C",
      },
      elevation: 100 + index,
      generationtime_ms: 0.5,
      latitude: Number(latitudes[index] || 53.9),
      longitude: Number(longitudes?.[index] || 27.56667),
      timezone:
        url.searchParams.get("timezone")?.split(",")?.[index] || "Europe/Minsk",
      timezone_abbreviation: "MSK",
      utc_offset_seconds: 10800,
    }));

    return HttpResponse.json(count === 1 ? forecasts[0] : forecasts);
  }),
];

const CITY_RESPONSES: Record<string, mockCityResponse[]> = {
  Minsk: [
    {
      id: 625144,
      name: "Minsk",
      country: "Belarus",
      latitude: 53.9,
      longitude: 27.56667,
      timezone: "Europe/Minsk",
    },
    {
      id: 2019920,
      name: "Minsk",
      country: "Russia",
      latitude: 57.0989,
      longitude: 93.33372,
      timezone: "Asia/Krasnoyarsk",
    },
    ...Array(6).fill({
      id: 625144,
      name: "Minsk",
      country: "Belarus",
      latitude: 53.9,
      longitude: 27.56667,
      timezone: "Europe/Minsk",
    }),
  ],

  Berlin: [
    ...Array(7).fill({
      id: 2950159,
      name: "Berlin",
      country: "Germany",
      latitude: 52.52437,
      longitude: 13.41053,
      timezone: "Europe/Berlin",
    }),
    {
      id: 4557666,
      name: "East Berlin",
      country: "United States",
      latitude: 39.9376,
      longitude: -76.97859,
      timezone: "America/New_York",
    },
  ],

  Warsaw: [
    ...Array(7).fill({
      id: 756135,
      name: "Warsaw",
      country: "Poland",
      latitude: 52.22977,
      longitude: 21.01178,
      timezone: "Europe/Warsaw",
    }),
    {
      id: 4915533,
      name: "Warsaw",
      country: "United States",
      latitude: 40.35921,
      longitude: -91.4346,
      timezone: "America/Chicago",
    },
  ],
};

interface mockCityResponse {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
