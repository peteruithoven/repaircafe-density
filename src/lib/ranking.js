import { extractCityCountry } from './geoapify.js';
import { getCoordinatePair, getSlugFromCafeLink } from './repairCafeRecord.js';
import { readStoredResult } from './resultStore.js';

export async function buildCityRanking(records, { top = 20 } = {}) {
  const grouped = new Map();
  let invalidCoordinates = 0;
  let missingResults = 0;
  let usableResults = 0;
  let unusableResults = 0;
  let usedResults = 0;

  for (const cafe of records) {
    if (!getCoordinatePair(cafe.coordinate)) {
      invalidCoordinates += 1;
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
      unusableResults += 1;
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
    invalidCoordinates,
    missingResults,
    usableResults,
    unusableResults,
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
