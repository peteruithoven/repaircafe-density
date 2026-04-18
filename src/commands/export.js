import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { ensureRepairCafeCache } from '../lib/repairCafeApi.js';
import { DATA_DIR } from '../lib/constants.js';
import { getSlugFromCafeLink } from '../lib/repairCafeRecord.js';
import { readStoredResult } from '../lib/resultStore.js';

const DEFAULT_OUTPUT_PATH = path.join(DATA_DIR, 'repaircafe-export.csv');
const GEOCODE_FIELDS = [
  'country',
  'country_code',
  'state',
  'state_code',
  'city',
  'postcode',
  'district',
  'plus_code',
];

export async function runExportCommand(options) {
  const outputPath = resolveOutputPath(options.output);
  const { cache } = await ensureRepairCafeCache();
  const baseFields = getBaseFields(cache.records);
  const header = ['slug', ...baseFields, ...GEOCODE_FIELDS];
  const rows = [header];

  for (const cafe of cache.records) {
    const slug = getSlugFromCafeLink(cafe.link);
    const geocodedProperties = await readGeocodedProperties(slug);
    const row = [
      slug,
      ...baseFields.map((field) => normalizeValue(cafe[field])),
      ...GEOCODE_FIELDS.map((field) => normalizeValue(geocodedProperties[field])),
    ];

    rows.push(row);
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${rows.map(toCsvLine).join('\n')}\n`, 'utf8');

  console.log(`Exported ${cache.records.length} Repair Cafes to ${outputPath}`);
}

function resolveOutputPath(output) {
  if (output === undefined || output === true) {
    return DEFAULT_OUTPUT_PATH;
  }

  return path.resolve(process.cwd(), String(output));
}

function getBaseFields(records) {
  const fields = [];
  const seenFields = new Set();

  for (const record of records) {
    for (const field of Object.keys(record)) {
      if (seenFields.has(field)) {
        continue;
      }

      seenFields.add(field);
      fields.push(field);
    }
  }

  return fields;
}

async function readGeocodedProperties(slug) {
  const result = await readStoredResult(slug);
  const properties = result?.features?.[0]?.properties;

  if (!properties || typeof properties !== 'object') {
    return {};
  }

  return properties;
}

function normalizeValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function toCsvLine(values) {
  return values.map(escapeCsvValue).join(',');
}

function escapeCsvValue(value) {
  if (/[,"\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}