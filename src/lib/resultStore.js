import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { RESULTS_DIR } from './constants.js';

export async function ensureResultDirectory() {
  await mkdir(RESULTS_DIR, { recursive: true });
}

export function getResultFilePath(slug) {
  return path.join(RESULTS_DIR, `${slug}.json`);
}

export async function hasStoredResult(slug) {
  try {
    const result = await stat(getResultFilePath(slug));
    return result.isFile();
  } catch (error) {
    if (isMissingFileError(error)) {
      return false;
    }

    throw error;
  }
}

export async function storeResult(slug, response) {
  await ensureResultDirectory();
  const filePath = getResultFilePath(slug);
  await writeFile(filePath, `${JSON.stringify(response, null, 2)}\n`, 'utf8');
}

export async function readStoredResult(slug) {
  try {
    const raw = await readFile(getResultFilePath(slug), 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }

    throw error;
  }
}

export async function listStoredResultSlugs() {
  await ensureResultDirectory();
  const entries = await readdir(RESULTS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name.slice(0, -'.json'.length))
    .sort();
}

function isMissingFileError(error) {
  return Boolean(error) && typeof error === 'object' && 'code' in error && error.code === 'ENOENT';
}
