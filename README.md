# @anasakil/storage-cache-anas

A lightweight key-value storage cache for Node.js with optional disk persistence, supporting any JavaScript data type.

## Installation
```bash
npm install @anasakil/storage-cache-anas

* ## Features
 * - Store any data type (strings, numbers, booleans, objects, arrays, etc.) in memory.
 * - Optional JSON file persistence for JSON-compatible types.
 * - TTL (time-to-live) support for expiring entries.
 * - Automatic cleanup of expired entries.
 * - No dependencies.
 *
 * ## Usage
 *
 * ### Storing Different Data Types
 * ```javascript
 * const StorageCache = require('@anasakil/storage-cache-anas');
 * const cache = new StorageCache({ persist: './data/cache.json' });
 *
 * (async () => {
 *   // String
 *   await cache.set('name', 'Anas', 5000);
 *   console.log(cache.get('name')); // 'Anas'
 *
 *   // Number
 *   await cache.set('age', 30);
 *   console.log(cache.get('age')); // 30
 *
 *   // Object
 *   await cache.set('user', { id: 1, name: 'Anas' }, 10000);
 *   console.log(cache.get('user')); // { id: 1, name: 'Anas' }
 *
 *   // Array
 *   await cache.set('items', [1, 2, 3]);
 *   console.log(cache.get('items')); // [1, 2, 3]
 *
 *   // Boolean
 *   await cache.set('active', true);
 *   console.log(cache.get('active')); // true
 *
 *   // Non-JSON type (memory-only with warning)
 *   await cache.set('func', () => console.log('test'));
 *   console.log(cache.get('func')); // [Function] (won’t persist to disk)
 * })();
 * ```
 *
 * ### Persistence Across Restarts
 * ```javascript
 * const StorageCache = require('@anasakil/storage-cache-anas');
 *
 * (async () => {
 *   const cache = new StorageCache({ persist: './data/cache.json' });
 *   await cache.set('config', { host: 'localhost', port: 3000 }, 60000);
 *   console.log(cache.get('config')); // { host: 'localhost', port: 3000 }
 *
 *   // Simulate restart
 *   const newCache = new StorageCache({ persist: './data/cache.json' });
 *   await newCache.init();
 *   console.log(newCache.get('config')); // { host: 'localhost', port: 3000 } (if not expired)
 * })();
 * ```
 *
 * ### Clear Cache
 * ```javascript
 * const cache = new StorageCache();
 * await cache.set('key', [1, 2, 3]);
 * await cache.clear();
 * console.log(cache.get('key')); // null
 * ```
 *
 * ## Methods
 * - **`.set(key, value, ttlMs)`**: Set any value with an optional TTL (in milliseconds).
 *   - `key`: A string identifier for the value.
 *   - `value`: Any JavaScript data type (string, number, object, array, etc.).
 *   - `ttlMs`: Optional expiration time in milliseconds (e.g., `5000` for 5 seconds); if omitted, the value persists until manually deleted or cleared.
 * - **`.get(key)`**: Get a value by key; returns `null` if expired or not found.
 *   - `key`: The string identifier to retrieve.
 * - **`.delete(key)`**: Delete a key and its associated value.
 *   - `key`: The string identifier to remove.
 * - **`.has(key)`**: Check if a key exists and isn’t expired; returns a boolean.
 *   - `key`: The string identifier to check.
 * - **`.clear()`**: Clear all entries from both memory and disk (if persistence is enabled).
 *
 * ## Configuration
 * - **`persist`**: Path to a JSON file for persistence (e.g., `'./cache.json'`) or `false` for memory-only storage.
 *   - Default: `false`.
 *   - Example: `{ persist: './data/cache.json' }` saves data to `data/cache.json`.
 *
 * ## Notes
 * - **Supported Types:** All JSON-compatible types (strings, numbers, booleans, objects, arrays, `null`) are fully supported in memory and on disk.
 * - **Non-JSON Types:** Functions, `undefined`, `Map`, `Set`, etc., are stored in memory but not persisted to disk (a warning is logged when attempting to persist these).
 * - **TTL:** Expired entries are automatically removed from both memory and disk.
 *
