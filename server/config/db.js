const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File paths for collections
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
  const filePath = collections[name];
  if (!filePath || !fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading collection ${name}:`, err);
    return [];
  }
}

function writeCollection(name, data) {
  const filePath = collections[name];
  if (!filePath) {
    throw new Error(`Collection ${name} does not exist`);
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  readCollection,
  writeCollection,
  collections,
};
