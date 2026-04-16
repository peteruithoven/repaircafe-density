import { reverseGeocodeCity } from '../lib/geoapify.js';
import { ensureRepairCafeCache } from '../lib/repairCafeApi.js';
import { getCoordinatePair, getSlugFromCafeLink } from '../lib/repairCafeRecord.js';
import {
  ensureResultDirectory,
  getResultFilePath,
  listStoredResultSlugs,
  storeResult,
} from '../lib/resultStore.js';

const DEFAULT_DELAY_MS = 250;
const DEFAULT_LIMIT = 100;

export async function runGeocodeMissingCommand(options) {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    throw new Error('Set GEOAPIFY_API_KEY before running geocode-missing.');
  }

  const limit = parsePositiveInteger(options.limit, DEFAULT_LIMIT, 'limit');
  const delayMs = parsePositiveInteger(options['delay-ms'], DEFAULT_DELAY_MS, 'delay-ms');
  await ensureResultDirectory();

  const { cache } = await ensureRepairCafeCache();
  const cafesWithCoordinates = [];
  let skippedInvalid = 0;

  for (const cafe of cache.records) {
    const coordinates = getCoordinatePair(cafe.coordinate);
    if (!coordinates) {
      skippedInvalid += 1;
      continue;
    }

    cafesWithCoordinates.push({
      cafe,
      coordinates,
    });
  }

  const storedResultSlugs = new Set(await listStoredResultSlugs());
  const pendingCafes = [];

  for (const entry of cafesWithCoordinates) {
    const slug = getSlugFromCafeLink(entry.cafe.link);
    if (storedResultSlugs.has(slug)) {
      continue;
    }

    pendingCafes.push({
      ...entry,
      slug,
    });
  }

  const targetCount = Math.min(limit, pendingCafes.length);

  let processed = 0;
  const skippedExisting = cafesWithCoordinates.length - pendingCafes.length;

  for (const { coordinates, slug } of pendingCafes) {
    if (processed >= targetCount) {
      break;
    }

    const response = await reverseGeocodeCity({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      apiKey,
    });

    await storeResult(slug, response);
    processed += 1;

    const filePath = getResultFilePath(slug);
    console.log(`[${processed}/${targetCount}] Stored ${slug} -> ${filePath}`);

    if (processed < targetCount) {
      await sleep(delayMs);
    }
  }

  console.log('');
  console.log(`New geocoding results stored: ${processed}`);
  console.log(`Already cached and skipped: ${skippedExisting}`);
  console.log(`Invalid coordinates skipped: ${skippedInvalid}`);

  if (processed === targetCount && pendingCafes.length > limit) {
    console.log(`Stopped at configured limit (${limit}) to keep daily API usage conservative.`);
  }
}

function parsePositiveInteger(value, fallback, name) {
  if (value === undefined || value === true) {
    return fallback;
  }

  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`--${name} must be a positive integer.`);
  }

  return parsed;
}

function sleep(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}
