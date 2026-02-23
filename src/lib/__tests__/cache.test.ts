import { describe, it, expect, beforeEach } from "vitest";
import { getCached, setCache, removeCache, clearAllCache, getCacheSize } from "@/lib/cache";
import { CACHE_PREFIX } from "@/lib/constants";

beforeEach(() => {
  // Clear all localStorage entries manually (jsdom-compatible)
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    localStorage.removeItem(key);
  }
});

describe("getCached", () => {
  it("returns null for missing keys", () => {
    expect(getCached("nonexistent")).toBeNull();
  });

  it("returns data for valid (non-expired) entries", () => {
    setCache("test-key", { value: 42 }, 60_000);
    expect(getCached<{ value: number }>("test-key")).toEqual({ value: 42 });
  });

  it("returns null and removes expired entries", () => {
    const entry = {
      data: { value: 42 },
      timestamp: Date.now() - 120_000,
      ttl: 60_000,
    };
    localStorage.setItem(CACHE_PREFIX + "old-key", JSON.stringify(entry));

    expect(getCached("old-key")).toBeNull();
    expect(localStorage.getItem(CACHE_PREFIX + "old-key")).toBeNull();
  });
});

describe("setCache", () => {
  it("stores data with timestamp and TTL", () => {
    setCache("store-test", { data: "hello" }, 30_000);
    const raw = localStorage.getItem(CACHE_PREFIX + "store-test");
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed.data).toEqual({ data: "hello" });
    expect(parsed.ttl).toBe(30_000);
    expect(typeof parsed.timestamp).toBe("number");
  });

  it("does not store when TTL is 0 (cache disabled)", () => {
    setCache("no-cache", { value: 1 }, 0);
    expect(localStorage.getItem(CACHE_PREFIX + "no-cache")).toBeNull();
  });
});

describe("removeCache", () => {
  it("deletes specific entry", () => {
    setCache("to-remove", "data", 60_000);
    expect(getCached("to-remove")).toBe("data");

    removeCache("to-remove");
    expect(getCached("to-remove")).toBeNull();
  });
});

describe("clearAllCache", () => {
  it("removes only prefixed entries, leaves others", () => {
    setCache("cached-a", "a", 60_000);
    setCache("cached-b", "b", 60_000);
    localStorage.setItem("other_key", "keep me");

    clearAllCache();

    expect(getCached("cached-a")).toBeNull();
    expect(getCached("cached-b")).toBeNull();
    expect(localStorage.getItem("other_key")).toBe("keep me");
  });
});

describe("getCacheSize", () => {
  it("returns correct count", () => {
    expect(getCacheSize()).toBe(0);

    setCache("item-1", "a", 60_000);
    setCache("item-2", "b", 60_000);
    setCache("item-3", "c", 60_000);

    expect(getCacheSize()).toBe(3);
  });

  it("does not count non-prefixed keys", () => {
    localStorage.setItem("random_key", "value");
    setCache("item", "a", 60_000);

    expect(getCacheSize()).toBe(1);
  });
});
