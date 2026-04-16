import { ensureRepairCafeCache } from '../lib/repairCafeApi.js';
import { listCafesWithInvalidCoordinates } from '../lib/ranking.js';

export async function runListInvalidCoordinatesCommand() {
  const { cache } = await ensureRepairCafeCache();
  const cafes = await listCafesWithInvalidCoordinates(cache.records);

  if (cafes.length === 0) {
    console.log('No Repair Cafes with invalid coordinates.');
    return;
  }

  for (const cafe of cafes) {
    console.log(cafe.link);
  }
}
