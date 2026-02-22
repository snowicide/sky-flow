import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://geocoding.api-open-meteo.com", ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");

    if (name === "Minsk") {
      return HttpResponse.json({
        results: [
          {
            name: "Minsk",
            country: "Belarus",
            id: 625144,
          },
          {
            name: "Minsk",
            country: "Russia",
            id: 1498696,
          },
          {
            name: "Minskiy",
            country: "Russia",
            id: 529528,
          },
          {
            name: "Minskiy",
            country: "Russia",
            id: 2019958,
          },
          {
            name: "Minskiy",
            country: "Kazakhstan",
            id: 11507753,
          },
          {
            name: "Minskip",
            country: "United Kingdom",
            id: 12262690,
          },
          {
            name: "Mińsk Mazowiecki",
            country: "Poland",
            id: 764679,
          },
          {
            name: "Minskoye",
            country: "Russia",
            id: 526415,
          },
        ],
      });
    }

    return new HttpResponse(null, { status: 404 });
  }),
];
