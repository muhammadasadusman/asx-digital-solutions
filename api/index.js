const app = require('../server/server');
const { seedData } = require('../server/data/seeds');

let seeded = false;

module.exports = async (req, res) => {
  if (!seeded) {
    try {
      await seedData();
    } catch (e) {
      console.warn('Seed initialization in serverless:', e.message);
    }
    seeded = true;
  }
  return app(req, res);
};
