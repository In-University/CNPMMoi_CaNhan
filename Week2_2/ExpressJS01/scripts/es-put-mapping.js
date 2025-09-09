require('dotenv').config();
const { updateIndexMapping, ES_INDEX } = require('../src/config/elasticsearch');

(async () => {
  try {
    const properties = {
      name: { type: 'text' },
      description: { type: 'text' },
      categoryName: { type: 'text' },
    };
    const res = await updateIndexMapping({ index: ES_INDEX, properties });
    console.log('Put mapping response:', res);
    process.exit(0);
  } catch (e) {
    console.error('Put mapping failed:', e.message || e);
    process.exit(1);
  }
})();
