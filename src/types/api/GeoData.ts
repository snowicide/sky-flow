import { z } from "zod";

export const GeoDataItemSchema = z
  .object({
    name: z.string(),
    country: z.string().catch("Unknown"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    timezone: z.string(),
    id: z.number().min(0).int(),
  })
  .strip();

export const GeoDataSchema = z.object({
  results: z.array(GeoDataItemSchema).optional().default([]),
});

export type GeoDataItem = z.infer<typeof GeoDataItemSchema>;
export type GeoData = z.infer<typeof GeoDataSchema>;
