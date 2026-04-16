import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PROJECT_ROOT = path.resolve(__dirname, '../..');
export const DATA_DIR = path.join(PROJECT_ROOT, 'data');
export const RESULTS_DIR = path.join(PROJECT_ROOT, 'results');
export const REPAIR_CAFE_MAP_URL = 'https://www.repaircafe.org/wp-json/v1/map';
export const REPAIR_CAFE_CACHE_PATH = path.join(DATA_DIR, 'repaircafe-map.json');
export const REPAIR_CAFE_LINK_PREFIX = 'https://www.repaircafe.org/cafe/';
