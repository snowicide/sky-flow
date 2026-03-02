import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://geocoding.api-open-meteo.com", ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const results = name
      ? CITY_RESPONSES[name as keyof typeof CITY_RESPONSES]
      : null;

    if (results) return HttpResponse.json({ results });

    return new HttpResponse(null, { status: 404 });
  }),

  http.get("https://api.open-meteo.com", ({ request }) => {
    const url = new URL(request.url);
    const latitude = url.searchParams.get("latitude");
    const longitude = url.searchParams.get("longitude");
    const city = url.searchParams.get("city");
    const country = url.searchParams.get("country");

    return HttpResponse.json({
      current: {
        latitude,
        longitude,
        city,
        country,
        temperature_2m: -2,
      },
      daily: {},
      hourly: {},
      forecastUnits: {},
    });
  }),
];

const CITY_RESPONSES: Record<string, mockCityResponse[]> = {
  Minsk: [
    ...Array(7).fill({
      id: 625144,
      city: "Minsk",
      country: "Belarus",
      latitude: 53.9,
      longitude: 27.56667,
    }),
    {
      id: 526415,
      name: "Minskoye",
      country: "Russia",
      latitude: 57.69351,
      longitude: 41.02806,
    },
  ],

  Berlin: [
    ...Array(7).fill({
      id: 2950159,
      city: "Berlin",
      country: "Germany",
      latitude: 52.52437,
      longitude: 13.41053,
    }),
    {
      id: 4557666,
      city: "East Berlin",
      country: "United States",
      latitude: 39.9376,
      longitude: -76.97859,
    },
  ],

  Warsaw: [
    ...Array(7).fill({
      id: 756135,
      city: "Warsaw",
      country: "Poland",
      latitude: 52.22977,
      longitude: 21.01178,
    }),
    {
      id: 4915533,
      city: "Warsaw",
      country: "United States",
      latitude: 40.35921,
      longitude: -91.4346,
    },
  ],
};

interface mockCityResponse {
  id: number;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}
