import { ensureRepairCafeCache } from '../lib/repairCafeApi.js';
import { buildCityRanking } from '../lib/ranking.js';

const DEFAULT_TOP = 20;

export async function runAnalyzeCommand(options) {
  const top = parsePositiveInteger(options.top, DEFAULT_TOP, 'top');
  const { cache } = await ensureRepairCafeCache();
  const summary = await buildCityRanking(cache.records, { top });

  console.log(`Top ${summary.topCount} cities by Repair Cafe count`);
  console.log('');

  if (summary.rows.length === 0) {
    console.log('No ranking data found. Run geocode-missing first.');
  } else {
    for (const row of summary.rows) {
      const rank = String(row.rank).padStart(2, ' ');
      const count = String(row.count).padStart(4, ' ');
      console.log(`${rank}. ${row.city}, ${row.country} (${count})`);
    }
  }

  console.log('');
  console.log(`Stored geocoding files used: ${summary.usedResults}`);
  console.log(`Missing geocoding files: ${summary.missingResults}`);
  console.log(`Usable city/country matches: ${summary.usableResults}`);
  console.log(`Skipped geocoding files without city/country: ${summary.unusableResults}`);
  console.log(`Repair Cafes with invalid coordinates: ${summary.invalidCoordinates}`);
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
