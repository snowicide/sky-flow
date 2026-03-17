import z from "zod";

export const SearchDataItemSchema = z
  .object({
    city: z.string(),
    country: z.string(),
    weatherCode: z.number().min(0).max(99),
    temperature: z.number(),
    temperatureUnit: z.string().transform((i) => {
      if (i === "°C" || i === "celsius") return "°C";
      if (i === "°F" || i === "fahrenheit") return "°F";
      return "°C";
    }),
    id: z.number().min(0).int(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strip();

export const SearchDataSchema = z.array(SearchDataItemSchema);

export type SearchDataItem = z.infer<typeof SearchDataItemSchema>;
