import { REPAIR_CAFE_LINK_PREFIX } from './constants.js';

export function getSlugFromCafeLink(link) {
  if (typeof link !== 'string' || link.length === 0) {
    throw new Error('Repair Cafe record is missing a link.');
  }

  if (link.startsWith(REPAIR_CAFE_LINK_PREFIX)) {
    return sanitizeSlug(link.slice(REPAIR_CAFE_LINK_PREFIX.length));
  }

  const url = new URL(link);
  return sanitizeSlug(url.pathname.replace(/^\/cafe\//, ''));
}

export function getCoordinatePair(coordinate) {
  if (typeof coordinate !== 'string') {
    return null;
  }

  const [latitudeRaw, longitudeRaw] = coordinate.split(',').map((value) => value.trim());
  const latitude = Number.parseFloat(latitudeRaw);
  const longitude = Number.parseFloat(longitudeRaw);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

function sanitizeSlug(slug) {
  return slug.replace(/^\/+|\/+$/g, '').replaceAll('/', '-');
}
