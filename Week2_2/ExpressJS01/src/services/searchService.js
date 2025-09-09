const { getElasticsearchClient } = require('../config/elasticsearch');

const INDEX = process.env.ELASTICSEARCH_INDEX || 'products';

async function ensureIndex() {
  const client = getElasticsearchClient();
  const existsRes = await client.indices.exists({ index: INDEX });
  const exists = (existsRes && existsRes.statusCode ? existsRes.statusCode === 200 : !!existsRes);
  if (!exists) {
    await client.indices.create({
      index: INDEX,
      settings: {
        analysis: {
          analyzer: {
            default: { type: 'standard' }
          }
        }
      },
      mappings: {
        properties: {
          name: { type: 'text' },
          description: { type: 'text' },
          categoryName: { type: 'text' },
          categoryId: { type: 'keyword' },
          price: { type: 'float' },
          stock: { type: 'integer' },
          image: { type: 'keyword', index: false },
          discount: { type: 'float' },
          views: { type: 'integer' },
          rating: { type: 'float' },
          featured: { type: 'boolean' },
          inStock: { type: 'boolean' },
          createdAt: { type: 'date' }
        }
      }
    });
  }
}

async function indexProduct(doc) {
  const client = getElasticsearchClient();
  await ensureIndex();
  const { _id, ...docBody } = doc;
  await client.index({ index: INDEX, id: _id.toString(), document: docBody, refresh: 'wait_for' });
}

async function bulkIndexProducts(docs) {
  const client = getElasticsearchClient();
  await ensureIndex();
  if (!docs || docs.length === 0) return { indexed: 0 };
  const operations = docs.flatMap((d) => {
    const { _id, ...docBody } = d; // Remove _id from document body
    return [
      { index: { _index: INDEX, _id: _id.toString() } },
      docBody,
    ];
  });
  const res = await client.bulk({ refresh: true, operations });
  const failures = (res.items || []).filter(i => i.index && i.index.error);
  if (failures.length > 0) {
    const sample = failures.slice(0, 3).map(f => f.index.error);
    console.error('Elasticsearch bulk index failures (sample):', JSON.stringify(sample, null, 2));
  }
  return { indexed: docs.length - failures.length, failed: failures.length };
}

async function removeProduct(id) {
  const client = getElasticsearchClient();
  try {
    await client.delete({ index: INDEX, id: id.toString() });
  } catch (e) {
    // ignore not found
  }
}

async function searchProducts({ 
  q, 
  categoryId, 
  minPrice, 
  maxPrice, 
  hasDiscount, 
  minViews, 
  minRating, 
  featured, 
  inStock, 
  sortBy = 'createdAt', 
  sortOrder = 'desc', 
  page = 1, 
  limit = 12 
}) {
  const client = getElasticsearchClient();
  await ensureIndex();
  const from = (page - 1) * limit;
  const must = [];
  const filter = [];

  // Text search
  if (q && q.trim()) {
    must.push({
      multi_match: {
        query: q,
        fields: ['name^3', 'description^1', 'categoryName^1'],
        fuzziness: 'AUTO',
        operator: 'and'
      }
    });
  } else {
    must.push({ match_all: {} });
  }

  // Category filter
  if (categoryId && categoryId !== 'all') {
    filter.push({ term: { categoryId } });
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceRange = {};
    if (minPrice !== undefined) priceRange.gte = parseFloat(minPrice);
    if (maxPrice !== undefined) priceRange.lte = parseFloat(maxPrice);
    filter.push({ range: { price: priceRange } });
  }

  // Discount filter
  if (hasDiscount === 'true') {
    filter.push({ range: { discount: { gt: 0 } } });
  } else if (hasDiscount === 'false') {
    filter.push({ term: { discount: 0 } });
  }

  // Views filter
  if (minViews !== undefined) {
    filter.push({ range: { views: { gte: parseInt(minViews) } } });
  }

  // Rating filter
  if (minRating !== undefined) {
    filter.push({ range: { rating: { gte: parseFloat(minRating) } } });
  }

  // Featured filter
  if (featured === 'true') {
    filter.push({ term: { featured: true } });
  } else if (featured === 'false') {
    filter.push({ term: { featured: false } });
  }

  // In stock filter
  if (inStock === 'true') {
    filter.push({ term: { inStock: true } });
  } else if (inStock === 'false') {
    filter.push({ term: { inStock: false } });
  }

  // Sort options
  const sortOptions = [];
  switch (sortBy) {
    case 'price':
      sortOptions.push({ price: { order: sortOrder } });
      break;
    case 'views':
      sortOptions.push({ views: { order: sortOrder } });
      break;
    case 'rating':
      sortOptions.push({ rating: { order: sortOrder } });
      break;
    case 'name':
      sortOptions.push({ 'name.keyword': { order: sortOrder, missing: '_last' } });
      break;
    default:
      sortOptions.push({ createdAt: { order: sortOrder } });
  }

  const result = await client.search({
    index: INDEX,
    from,
    size: limit,
    query: { bool: { must, filter } },
    sort: sortOptions
  });
  
  console.log('Search query:', JSON.stringify({ bool: { must, filter } }, null, 2));
  console.log('Search result:', result);
  
  const hits = result.hits?.hits || [];
  const total = typeof result.hits?.total === 'object' ? result.hits.total.value : (result.hits?.total || 0);
  return { total, items: hits.map(h => ({ _score: h._score, ...h._source })) };
}

module.exports = { ensureIndex, indexProduct, bulkIndexProducts, removeProduct, searchProducts };
