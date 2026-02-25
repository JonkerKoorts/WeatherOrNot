import type { CacheEntry } from "@/types/weather";
import { CACHE_PREFIX } from "@/lib/constants";

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const now = Date.now();

    if (now - entry.timestamp > entry.ttl) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Evict expired cache entries to free up localStorage space.
 * Called automatically when storage quota is exceeded.
 */
function evictExpiredEntries(): void {
  const now = Date.now();
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (!key.startsWith(CACHE_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const entry = JSON.parse(raw) as CacheEntry<unknown>;
      if (now - entry.timestamp > entry.ttl) {
        localStorage.removeItem(key);
      }
    } catch {
      // Corrupted entry — remove it
      localStorage.removeItem(key);
    }
  }
}

export function setCache<T>(
  key: string,
  data: T,
  ttlMs: number,
): void {
  if (ttlMs <= 0) return;

  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  };

  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Likely quota exceeded — evict expired entries and retry once
    try {
      evictExpiredEntries();
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch {
      // Storage still full or unavailable — silently fail
    }
  }
}

export function removeCache(key: string): void {
  localStorage.removeItem(CACHE_PREFIX + key);
}

export function clearAllCache(): void {
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}

export function getCacheSize(): number {
  let count = 0;
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key.startsWith(CACHE_PREFIX)) {
      count++;
    }
  }
  return count;
}
