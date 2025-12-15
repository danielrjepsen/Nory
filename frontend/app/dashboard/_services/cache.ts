interface CacheEntry<T> {
  data: T;
  expires: number;
}

interface Config {
  defaultTTL?: number;
  maxSize?: number;
}

const TTL = {
  ONE_MINUTE: 60_000,
  FIVE_MINUTES: 300_000,
  TEN_MINUTES: 600_000,
} as const;

export class CacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();
  private readonly defaultTTL: number;
  private readonly maxSize: number;

  constructor(config: Config = {}) {
    this.defaultTTL = config.defaultTTL ?? TTL.ONE_MINUTE;
    this.maxSize = config.maxSize ?? 100;
  }

  get<T>(key: string): T | null {
    const cached = this.store.get(key);
    if (!cached) return null;

    if (cached.expires <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    return cached.data as T;
  }

  set<T>(key: string, data: T, ttlMs?: number): void {
    if (this.store.size >= this.maxSize) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }
    this.store.set(key, { data, expires: Date.now() + (ttlMs ?? this.defaultTTL) });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  clearExpired(): number {
    const now = Date.now();
    let count = 0;
    for (const [key, entry] of Array.from(this.store.entries())) {
      if (entry.expires <= now) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlMs?: number): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetcher();
    this.set(key, data, ttlMs);
    return data;
  }

  invalidateByPrefix(prefix: string): number {
    let count = 0;
    for (const key of Array.from(this.store.keys())) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  keys(): string[] {
    return Array.from(this.store.keys());
  }

  size(): number {
    return this.store.size;
  }
}

export const analyticsCache = new CacheService({ defaultTTL: TTL.ONE_MINUTE, maxSize: 100 });
export const eventCache = new CacheService({ defaultTTL: TTL.FIVE_MINUTES, maxSize: 50 });
export const userCache = new CacheService({ defaultTTL: TTL.TEN_MINUTES, maxSize: 20 });

if (typeof window !== 'undefined') {
  setInterval(() => {
    analyticsCache.clearExpired();
    eventCache.clearExpired();
    userCache.clearExpired();
  }, TTL.FIVE_MINUTES);
}
