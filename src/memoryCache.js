class MemoryCache {
    constructor() {
      this.store = new Map();
      this.timers = new Map();
    }
  
    set(key, value, ttlMs = null) {
      if (this.timers.has(key)) clearTimeout(this.timers.get(key));
      this.store.set(key, { value, expiresAt: ttlMs ? Date.now() + ttlMs : null });
  
      if (ttlMs) {
        this.timers.set(key, setTimeout(() => this.delete(key), ttlMs));
      }
    }
  
    get(key) {
      const entry = this.store.get(key);
      if (!entry || (entry.expiresAt && entry.expiresAt < Date.now())) {
        this.delete(key);
        return null;
      }
      return entry.value;
    }
  
    delete(key) {
      if (this.timers.has(key)) clearTimeout(this.timers.get(key));
      this.timers.delete(key);
      this.store.delete(key);
    }
  
    has(key) {
      const entry = this.store.get(key);
      if (!entry || (entry.expiresAt && entry.expiresAt < Date.now())) {
        this.delete(key);
        return false;
      }
      return true;
    }
  
    clear() {
      for (const timer of this.timers.values()) clearTimeout(timer);
      this.timers.clear();
      this.store.clear();
    }
  
    toJSON() {
      const obj = {};
      for (const [key, entry] of this.store) {
        if (!entry.expiresAt || entry.expiresAt > Date.now()) {
          if (!this.isJsonSerializable(entry.value)) {
            console.warn(`Value for key '${key}' contains non-JSON-serializable data (e.g., functions, undefined). It will be memory-only.`);
          }
          obj[key] = { value: entry.value, expiresAt: entry.expiresAt };
        }
      }
      return obj;
    }
  
    isJsonSerializable(value) {
      try {
        JSON.stringify(value);
        return true;
      } catch {
        return false;
      }
    }
  }
  
  module.exports = MemoryCache;