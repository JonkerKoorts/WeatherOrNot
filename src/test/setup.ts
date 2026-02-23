import "@testing-library/jest-dom/vitest";

// Provide a working localStorage mock for jsdom environments
// where the native localStorage may not function properly
const store = new Map<string, string>();

const localStorageMock: Storage = {
  getItem(key: string) {
    return store.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    store.set(key, value);
  },
  removeItem(key: string) {
    store.delete(key);
  },
  clear() {
    store.clear();
  },
  get length() {
    return store.size;
  },
  key(index: number) {
    return [...store.keys()][index] ?? null;
  },
};

// Override Object.keys to work with our mock
Object.defineProperty(localStorageMock, Symbol.iterator, {
  value: function* () {
    yield* store.keys();
  },
});

// Make Object.keys(localStorage) work
const originalKeys = Object.keys;
const patchedKeys = function (obj: object): string[] {
  if (obj === globalThis.localStorage) {
    return [...store.keys()];
  }
  return originalKeys(obj);
};
Object.keys = patchedKeys;

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});
