import "server-only";
import type { ServerRequestData } from "./types";

export function getAiPrompt(data: ServerRequestData) {
  const { city, country, region, lat, lon, option, temperature, condition } =
    data;

  const location = `${city}${country ? `, ${country}` : ""}${region ? `, ${region}` : ""}`;
  const coords = `${lat} latitude and ${lon} longitude`;

  const prompts = {
    location: `You are an friendly expert local guide and urban historian. 
                 Tell one surprising, little-known, or unique fact about ${location} (${coords}). 
                 Focus on quirky history, hidden architecture, or unusual local traditions. 
                 Keep it to 2-3 engaging sentences in English. 
                 Use a friendly emoji at the end.`,
    weather: `You are a friendly meteorologist.
                 Write a short (1-2 sentences), warm, and lively
                 description of the weather in ${location} (${coords}) in English.
                 It's ${temperature}°C now, it's ${condition} outside.
                 Give some advice on the current weather.
                 Use friendly emoji at the end.`,
  };

  return prompts[option];
}
