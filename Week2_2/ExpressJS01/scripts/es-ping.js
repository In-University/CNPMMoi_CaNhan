require('dotenv').config();
const { ping } = require('../src/config/elasticsearch');

(async () => {
  try {
    await ping();
    console.log('Elasticsearch ping: OK');
    process.exit(0);
  } catch (e) {
    console.error('Elasticsearch ping: FAILED', e.message || e);
    process.exit(1);
  }
})();
