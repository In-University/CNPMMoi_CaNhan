require('dotenv').config();
const connection = require('../src/config/database');
const { indexAllProducts } = require('../src/jobs/indexProducts');

(async () => {
  try {
    await connection();
    await indexAllProducts();
    console.log('Indexed all products successfully');
    process.exit(0);
  } catch (e) {
    console.error('Index all products failed:', e.message || e);
    process.exit(1);
  }
})();
