// Safe localStorage helpers: never throw, always validate shape.
const PREFIX = 'relive:';

const pick = (area) => (area === 'session' ? window.sessionStorage : window.localStorage);

export function read(key, fallback, validate = () => true, area = 'local') {
  try {
    const raw = pick(area).getItem(PREFIX + key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function write(key, value, area = 'local') {
  try {
    pick(area).setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false; // quota exceeded or storage disabled
  }
}

export function remove(key, area = 'local') {
  try {
    pick(area).removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export const isArray = (v) => Array.isArray(v);
export const isObject = (v) => v != null && typeof v === 'object' && !Array.isArray(v);
