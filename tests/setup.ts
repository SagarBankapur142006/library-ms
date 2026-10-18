// In-memory mock for localStorage in Node test environment
let store: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string): string | null => {
    return store[key] !== undefined ? store[key] : null;
  },
  setItem: (key: string, value: string): void => {
    store[key] = String(value);
  },
  removeItem: (key: string): void => {
    delete store[key];
  },
  clear: (): void => {
    store = {};
  },
  key: (index: number): string | null => {
    const keys = Object.keys(store);
    return keys[index] || null;
  },
  get length(): number {
    return Object.keys(store).length;
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

beforeEach(() => {
  store = {};
});
