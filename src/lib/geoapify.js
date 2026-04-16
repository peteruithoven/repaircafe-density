const GEOAPIFY_REVERSE_GEOCODE_URL = 'https://api.geoapify.com/v1/geocode/reverse';

export async function reverseGeocodeCity({ latitude, longitude, apiKey }) {
  const url = new URL(GEOAPIFY_REVERSE_GEOCODE_URL);
  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));
  url.searchParams.set('type', 'city');
  url.searchParams.set('apiKey', apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geoapify reverse geocoding failed with status ${response.status}.`);
  }

  return response.json();
}

export function extractCityCountry(geoapifyResponse) {
  const { city, country } = extractCityCountryParts(geoapifyResponse);

  if (!city || !country) {
    return null;
  }

  return { city, country };
}

export function extractCityCountryParts(geoapifyResponse) {
  const properties = geoapifyResponse?.features?.[0]?.properties;
  if (!properties || typeof properties !== 'object') {
    return { city: null, country: null };
  }

  const city = firstNonEmptyString([
    properties.city,
    properties.town,
    properties.village,
    properties.municipality,
  ]);
  const country = firstNonEmptyString([properties.country]);

  return { city, country };
}

function firstNonEmptyString(values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}
