import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { DATA_DIR, REPAIR_CAFE_CACHE_PATH, REPAIR_CAFE_MAP_URL } from './constants.js';

export async function ensureRepairCafeCache() {
  const cached = await readRepairCafeCache();
  if (cached) {
    return {
      cache: cached,
      cachePath: REPAIR_CAFE_CACHE_PATH,
      usedCache: true,
    };
  }

  const response = await fetch(REPAIR_CAFE_MAP_URL);
  if (!response.ok) {
    throw new Error(`Repair Cafe API request failed with status ${response.status}.`);
  }

  const records = await response.json();
  if (!Array.isArray(records)) {
    throw new Error('Repair Cafe API returned an unexpected payload.');
  }

  const cache = {
    fetchedAt: new Date().toISOString(),
    recordCount: records.length,
    sourceUrl: REPAIR_CAFE_MAP_URL,
    records,
  };

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(REPAIR_CAFE_CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');

  return {
    cache,
    cachePath: REPAIR_CAFE_CACHE_PATH,
    usedCache: false,
  };
}

export async function readRepairCafeCache() {
  try {
    const raw = await readFile(REPAIR_CAFE_CACHE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    validateCacheShape(parsed);
    return parsed;
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }

    throw error;
  }
}

function validateCacheShape(cache) {
  if (!cache || typeof cache !== 'object') {
    throw new Error('Repair Cafe cache is not a JSON object.');
  }

  if (!Array.isArray(cache.records)) {
    throw new Error('Repair Cafe cache is missing a records array.');
  }
}

function isMissingFileError(error) {
  return Boolean(error) && typeof error === 'object' && 'code' in error && error.code === 'ENOENT';
}
