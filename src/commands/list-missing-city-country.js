import { ensureRepairCafeCache } from '../lib/repairCafeApi.js';
import { listCafesMissingCityCountry } from '../lib/ranking.js';

export async function runListMissingCityCountryCommand() {
  const { cache } = await ensureRepairCafeCache();
  const cafes = await listCafesMissingCityCountry(cache.records);

  if (cafes.length === 0) {
    console.log('No stored geocoding results without city/country.');
    return;
  }

  for (const cafe of cafes) {
    console.log(cafe.link);
  }
}
