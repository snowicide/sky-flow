import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";

const schema = z.object({
  option: z.enum(["location", "weather"]),
  city: z.string(),
  country: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  temperature: z.number().optional(),
  condition: z.string().optional(),
});

export const maxDuration = 30;
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const data = schema.safeParse(body);

    if (!data.success)
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const { city, country, region, lat, lon, temperature, condition, option } =
      data.data;

    const location = `${city}${country ? `, ${country}` : ""}${region ? `, ${region}` : ""}`;
    const coords = `${lat} latitude and ${lon} longitude`;

    const optionConfig: OptionConfig = {
      location: {
        system: "You are a professional and friendly local guide and historian",
        prompt: `You are an friendly expert local guide and urban historian. 
                 Tell one surprising, little-known, or unique fact about ${location} (${coords}). 
                 Focus on quirky history, hidden architecture, or unusual local traditions. 
                 Keep it to 2-3 engaging sentences in English. 
                 Use a friendly emoji at the end.`,
        temperature: 0.9,
      },
      weather: {
        system: "You are a professional and friendly meteorologist",
        prompt: `You are a friendly meteorologist.
                 Write a short (1-2 sentences), warm, and lively
                 description of the weather in ${location} (${coords}) in English.
                 It's ${temperature}°C now, it's ${condition} outside.
                 Give some advice on the current weather.
                 Use friendly emoji at the end`,
        temperature: 0.7,
      },
    };

    const currentConfig = optionConfig[option];

    const streamResult = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: currentConfig.system,
      prompt: currentConfig.prompt,
      temperature: currentConfig.temperature,
      maxOutputTokens: 150,
    });

    return streamResult.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 },
    );
  }
}

type OptionConfig = {
  location: {
    system: string;
    prompt: string;
    temperature: number;
  };
  weather: {
    system: string;
    prompt: string;
    temperature: number;
  };
};
