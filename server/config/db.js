const fs = require('fs');
const path = require('path');

// Support both standard server and Vercel serverless environment
const isVercel = Boolean(process.env.VERCEL);
const DEFAULT_DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_DIR = isVercel ? path.join('/tmp', 'asx-data') : DEFAULT_DATA_DIR;

// In-memory cache fallback
const memoryCache = {};

function initDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      console.warn('Could not create DATA_DIR:', e.message);
    }
  }

  // If on Vercel, copy initial seed files from default data dir to /tmp/asx-data if not exists
  if (isVercel && fs.existsSync(DEFAULT_DATA_DIR)) {
    try {
      const files = fs.readdirSync(DEFAULT_DATA_DIR);
      for (const file of files) {
        const src = path.join(DEFAULT_DATA_DIR, file);
        const dest = path.join(DATA_DIR, file);
        if (!fs.existsSync(dest) && fs.statSync(src).isFile()) {
          fs.copyFileSync(src, dest);
        }
      }
    } catch (e) {
      console.warn('Failed to copy seeds to /tmp:', e.message);
    }
  }
}

initDataDir();

const collections = {
  users: path.join(DATA_DIR, 'users.json'),
  services: path.join(DATA_DIR, 'services.json'),
  portfolio: path.join(DATA_DIR, 'portfolio.json'),
  team: path.join(DATA_DIR, 'team.json'),
  reviews: path.join(DATA_DIR, 'reviews.json'),
  billing: path.join(DATA_DIR, 'billing.json'),
  invoices: path.join(DATA_DIR, 'invoices.json'),
  messages: path.join(DATA_DIR, 'messages.json'),
};

function readCollection(name) {
  // 1. Check memory cache first
  if (memoryCache[name] && Array.isArray(memoryCache[name]) && memoryCache[name].length > 0) {
    return memoryCache[name];
  }

  // 2. Try reading from DATA_DIR
  const filePath = collections[name];
  if (filePath && fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryCache[name] = parsed;
      return parsed;
    } catch (err) {
      console.error(`Error reading collection ${name}:`, err);
    }
  }

  // 3. Fallback to DEFAULT_DATA_DIR if on Vercel
  if (isVercel) {
    const fallbackPath = path.join(DEFAULT_DATA_DIR, `${name}.json`);
    if (fs.existsSync(fallbackPath)) {
      try {
        const raw = fs.readFileSync(fallbackPath, 'utf-8');
        const parsed = JSON.parse(raw);
        memoryCache[name] = parsed;
        return parsed;
      } catch (e) {}
    }
  }

  return [];
}

function writeCollection(name, data) {
  memoryCache[name] = data;
  const filePath = collections[name];
  if (filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.warn(`Write to disk failed for ${name}, maintained in memory:`, err.message);
    }
  }
}

module.exports = {
  readCollection,
  writeCollection,
  collections,
};
