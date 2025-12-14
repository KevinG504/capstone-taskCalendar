const fs = require('fs').promises;
const path = require('path');

class Database {
  constructor(dataDir = './data') {
    this.dataDir = dataDir;
    this.cache = {}; 
  }
   //Initialize database and ensure data directory exists
  async init() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      console.log('✓ Database initialized');
    } catch (err) {
      console.error('Database init error:', err);
      throw err;
    }
  }

   //Get file path for a collection

  getFilePath(collection) {
    return path.join(this.dataDir, `${collection}.json`);
  }

   //Load a collection into cache
   //Returns empty array if file doesn't exist yet
  async load(collection) {
    const filePath = this.getFilePath(collection);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      this.cache[collection] = JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File doesn't exist yet - initialize empty
        this.cache[collection] = [];
      } else {
        throw err;
      }
    }
    
    return this.cache[collection];
  }

  async save(collection) {
    const filePath = this.getFilePath(collection);
    const tmpPath = `${filePath}.tmp`;
    
    try {
      // Write to temp file first
      await fs.writeFile(tmpPath, JSON.stringify(this.cache[collection], null, 2));
      await fs.rename(tmpPath, filePath);
    } catch (err) {

      try {
        await fs.unlink(tmpPath);
      } catch (unlinkErr) {
      }
      throw err;
    }
  }
   //Get all items from a collection

  async getAll(collection) {
    if (!this.cache[collection]) {
      await this.load(collection);
    }
    return [...this.cache[collection]]; // Return copy
  }

  //Get single item by ID

  async getById(collection, id) {
    const items = await this.getAll(collection);
    return items.find(item => item.id === id) || null;
  }

   //Create new item with auto-generated ID

  async create(collection, data) {
    if (!this.cache[collection]) {
      await this.load(collection);
    }

    const newItem = {
      id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };

    this.cache[collection].push(newItem);
    await this.save(collection);
    
    return newItem;
  }

   // Update existing item

  async update(collection, id, updates) {
    if (!this.cache[collection]) {
      await this.load(collection);
    }

    const index = this.cache[collection].findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }

    this.cache[collection][index] = {
      ...this.cache[collection][index],
      ...updates,
      id, 
      updatedAt: new Date().toISOString()
    };

    await this.save(collection);
    return this.cache[collection][index];
  }

   // Delete item
  async delete(collection, id) {
    if (!this.cache[collection]) {
      await this.load(collection);
    }

    const index = this.cache[collection].findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }

    this.cache[collection].splice(index, 1);
    await this.save(collection);
    
    return true;
  }

//unique ID
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

const db = new Database();
module.exports = db;