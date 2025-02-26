const MemoryCache = require('./memoryCache');
const DiskStore = require('./diskStore');

class StorageCache {
  constructor(options = {}) {
    this.memory = new MemoryCache();
    this.disk = options.persist ? new DiskStore(options.persist) : null;
    this.init();
  }

  async init() {
    if (this.disk) {
      const data = await this.disk.load();
      for (const [key, { value, expiresAt }] of Object.entries(data)) {
        const ttl = expiresAt ? expiresAt - Date.now() : null;
        if (ttl === null || ttl > 0) {
          this.memory.set(key, value, ttl);
        }
      }
    }
  }

  async set(key, value, ttlMs = null) {
    this.memory.set(key, value, ttlMs);
    if (this.disk) await this.disk.save(this.memory.toJSON());
  }

  get(key) {
    return this.memory.get(key);
  }

  async delete(key) {
    this.memory.delete(key);
    if (this.disk) await this.disk.save(this.memory.toJSON());
  }

  has(key) {
    return this.memory.has(key);
  }

  async clear() {
    this.memory.clear();
    if (this.disk) await this.disk.save({});
  }
}

module.exports = StorageCache;