const fs = require('fs').promises;
const path = require('path');

class DiskStore {
  constructor(filePath) {
    this.filePath = path.resolve(filePath || './cache.json');
  }

  async load() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') return {};
      throw error;
    }
  }

  async save(data) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}

module.exports = DiskStore;