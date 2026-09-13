// Minimal in-process TTL cache for hot read endpoints (e.g. builder storefronts).
// Lives only in this Node process's memory — see CACHING.md for scope/limits.
const store = new Map();

export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

export function cacheSet(key, value, ttlMs) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function cacheDelete(key) {
  store.delete(key);
}

export function cacheDeleteByPrefix(prefix) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

// Wraps an async producer with cache-aside semantics: serve from cache if
// fresh, otherwise compute, store, and return.
export async function cached(key, ttlMs, produce) {
  const hit = cacheGet(key);
  if (hit !== undefined) return hit;
  const value = await produce();
  cacheSet(key, value, ttlMs);
  return value;
}
