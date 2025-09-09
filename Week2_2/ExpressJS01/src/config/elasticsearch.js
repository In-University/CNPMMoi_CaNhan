const { Client } = require('@elastic/elasticsearch');

const ES_NODE = process.env.ELASTICSEARCH_NODE || process.env.ES_NODE || 'http://localhost:9200';
const ES_USERNAME = process.env.ELASTICSEARCH_USERNAME || process.env.ES_USERNAME || undefined;
const ES_PASSWORD = process.env.ELASTICSEARCH_PASSWORD || process.env.ES_PASSWORD || undefined;
const ES_API_KEY = process.env.ELASTICSEARCH_API_KEY || process.env.ES_API_KEY || undefined;
const ES_INDEX = process.env.ELASTICSEARCH_INDEX || process.env.ES_INDEX || 'products';

let client;

function getElasticsearchClient() {
  if (!client) {
    const config = { node: ES_NODE };
    if (ES_API_KEY) {
      config.auth = { apiKey: ES_API_KEY };
    } else if (ES_USERNAME && ES_PASSWORD) {
      config.auth = { username: ES_USERNAME, password: ES_PASSWORD };
    }
    client = new Client(config);
  }
  return client;
}

async function updateIndexMapping({ index, properties }) {
  const es = getElasticsearchClient();
  return es.indices.putMapping({ index, properties });
}
async function ping() {
  const es = getElasticsearchClient();
  try {
    const ok = await es.ping();
    return ok; // true
  } catch (e) {
    throw e;
  }
}

module.exports = { getElasticsearchClient, updateIndexMapping, ES_INDEX, ping };
