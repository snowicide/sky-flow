export const generateCityId = (
  city: string,
  region?: string,
  country?: string,
): string => {
  const baseId = city.toLowerCase();
  const regionId = region
    ? `${baseId}-${region.toLowerCase().replace(/\s+/g, "-")}`
    : baseId;
  const id = country
    ? `${regionId}-${country.toLowerCase().replace(/\s+/g, "-")}`
    : regionId;

  return id;
};
