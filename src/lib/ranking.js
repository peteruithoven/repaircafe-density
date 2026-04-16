import { extractCityCountry, extractCityCountryParts } from './geoapify.js';
import { getCoordinatePair, getSlugFromCafeLink } from './repairCafeRecord.js';
import { readStoredResult } from './resultStore.js';

export async function buildCityRanking(records, { top = 20 } = {}) {
  const grouped = new Map();
  const totalRepairCafes = records.length;
  let invalidCoordinates = 0;
  let missingCity = 0;
  let missingCountry = 0;
  let missingResults = 0;
  let usableResults = 0;
  let usedResults = 0;

  for (const cafe of records) {
    const coordinates = getCoordinatePair(cafe.coordinate);
    if (!coordinates) {
      invalidCoordinates += 1;
      continue;
    }

    const slug = getSlugFromCafeLink(cafe.link);
    const geoapifyResponse = await readStoredResult(slug);

    if (!geoapifyResponse) {
      missingResults += 1;
      continue;
    }

    usedResults += 1;
    const location = extractCityCountry(geoapifyResponse);
    if (!location) {
      const parts = extractCityCountryParts(geoapifyResponse);
      if (!parts.city) {
        missingCity += 1;
      }

      if (!parts.country) {
        missingCountry += 1;
      }

      continue;
    }

    usableResults += 1;
    const key = `${location.city}\u0000${location.country}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.count += 1;
      continue;
    }

    grouped.set(key, {
      city: location.city,
      country: location.country,
      count: 1,
    });
  }

  const rows = [...grouped.values()]
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      const byCountry = left.country.localeCompare(right.country);
      if (byCountry !== 0) {
        return byCountry;
      }

      return left.city.localeCompare(right.city);
    })
    .slice(0, top)
    .map((row, index) => ({
      rank: index + 1,
      ...row,
    }));

  return {
    rows,
    topCount: top,
    totalRepairCafes,
    repairCafesWithCoordinates: totalRepairCafes - invalidCoordinates,
    invalidCoordinates,
    missingCity,
    missingCountry,
    missingResults,
    usableResults,
    usedResults,
  };
}

export async function listCafesMissingCityCountry(records) {
  const cafes = [];

  for (const cafe of records) {
    const slug = getSlugFromCafeLink(cafe.link);
    const geoapifyResponse = await readStoredResult(slug);

    if (!geoapifyResponse) {
      continue;
    }

    const location = extractCityCountry(geoapifyResponse);
    if (location) {
      continue;
    }

    cafes.push({
      link: cafe.link,
      slug,
    });
  }

  return cafes;
}

export async function listCafesWithInvalidCoordinates(records) {
  const cafes = [];

  for (const cafe of records) {
    if (getCoordinatePair(cafe.coordinate)) {
      continue;
    }

    cafes.push({
      link: cafe.link,
      slug: getSlugFromCafeLink(cafe.link),
    });
  }

  return cafes;
}
