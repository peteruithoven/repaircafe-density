import { ensureRepairCafeCache } from '../lib/repairCafeApi.js';

export async function runFetchCommand() {
  const result = await ensureRepairCafeCache();

  if (result.usedCache) {
    console.log(`Using existing Repair Cafe cache: ${result.cachePath}`);
    console.log(`Cached records: ${result.cache.recordCount}`);
    console.log(`Cached at: ${result.cache.fetchedAt}`);
    return;
  }

  console.log(`Fetched Repair Cafe API and cached ${result.cache.recordCount} records.`);
  console.log(`Cache written to: ${result.cachePath}`);
}
