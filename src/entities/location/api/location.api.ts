import { handleApiError, request } from "@shared/api";
import { API_CONFIG } from "@shared/config/constants";

import { type GeoResponseDto, GeoResponseDtoSchema } from "./dto";

export async function fetchGeoData(
  city: string,
  signal?: AbortSignal,
): Promise<GeoResponseDto> {
  try {
    const geoUrl = `${API_CONFIG.GEO_BASE_URL}/v1/search?name=${encodeURIComponent(city)}&count=8&language=en`;
    const data = await request<GeoResponseDto>(
      geoUrl,
      { signal },
      "GEOCODING_FAILED",
      true,
    );

    if (!data || !data.results) return { results: [] };

    return GeoResponseDtoSchema.parse(data);
  } catch (error) {
    handleApiError(error);
  }
}
