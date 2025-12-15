interface CacheEntry<T> {
  data: T;
  expires: number;
}

export interface CacheConfig {
  defaultTTL?: number;
  maxSize?: number;
}

export class CacheService {
  private store = new Map<string, CacheEntry<unknown>>();
  private defaultTTL: number;
  private maxSize: number;

  constructor(config: CacheConfig = {}) {
    this.defaultTTL = config.defaultTTL ?? 60000;
    this.maxSize = config.maxSize ?? 100;
  }

  get<T>(key: string): T | null {
    const cached = this.store.get(key);

    if (!cached) {
      return null;
    }

    if (cached.expires <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return cached.data as T;
  }

  set<T>(key: string, data: T, ttlMs?: number): void {
    if (this.store.size >= this.maxSize) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) {
        this.store.delete(firstKey);
      }
    }

    this.store.set(key, {
      data,
      expires: Date.now() + (ttlMs ?? this.defaultTTL),
    });
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

    const entries = Array.from(this.store.entries());
    for (const [key, entry] of entries) {
      if (entry.expires <= now) {
        this.store.delete(key);
        count++;
      }
    }

    return count;
  }

  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    const values = Array.from(this.store.values());
    for (const entry of values) {
      if (entry.expires <= now) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.store.size,
      active,
      expired,
      maxSize: this.maxSize,
      utilizationPercent: (this.store.size / this.maxSize) * 100,
    };
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data, ttlMs);
    return data;
  }

  invalidateByPrefix(prefix: string): number {
    let count = 0;

    const keys = Array.from(this.store.keys());
    for (const key of keys) {
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

export const analyticsCache = new CacheService({
  defaultTTL: 60000, 
  maxSize: 100,
});

export const eventCache = new CacheService({
  defaultTTL: 300000, 
  maxSize: 50,
});

export const userCache = new CacheService({
  defaultTTL: 600000, 
  maxSize: 20,
});

if (typeof window !== 'undefined') {
  setInterval(() => {
    analyticsCache.clearExpired();
    eventCache.clearExpired();
    userCache.clearExpired();
  }, 300000);
}
