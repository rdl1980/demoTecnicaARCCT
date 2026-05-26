// Cell: catalog
const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

function stockLevel(qty) {
  if (qty === 0) return 'out_of_stock';
  if (qty < 5)  return 'low_stock';
  return 'in_stock';
}

function formatProduct(row) {
  return {
    sku:          row.sku,
    name:         row.name,
    brand:        row.brand_name,
    category:     row.category_name,
    price_cents:  row.price_cents,
    discount_pct: row.discount_pct ?? null,
    stock_level:  stockLevel(row.stock_qty),
    stock_qty:    row.stock_qty,
  };
}

// GET /api/catalog/products
router.get('/products', (req, res) => {
  const db = getDb();
  const { category, brand, q, stock } = req.query;

  let sql = `
    SELECT p.*, c.name AS category_name, b.name AS brand_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    JOIN brands     b ON b.id = p.brand_id
    WHERE 1=1
  `;
  const params = [];

  if (category) { sql += ' AND c.name = ?'; params.push(category); }
  if (brand)    { sql += ' AND b.name = ?'; params.push(brand); }
  if (stock)    { sql += ' AND p.stock_level = ?'; params.push(stock); }

  if (q) {
    const like = `%${q}%`;
    sql += `
      AND (p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?
           OR b.name LIKE ?
           OR p.id IN (
             SELECT product_id FROM product_compatibility WHERE model LIKE ?
           ))
    `;
    params.push(like, like, like, like, like);
  }

  sql += ' ORDER BY p.id';
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(formatProduct));
});

// POST /api/catalog/products/stock-check
router.post('/products/stock-check', (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array required' });
  }
  for (const item of items) {
    if (typeof item.sku !== 'string' || !item.sku) {
      return res.status(400).json({ error: 'each item must have a sku string' });
    }
    if (!Number.isInteger(item.requested_qty) || item.requested_qty < 1) {
      return res.status(400).json({ error: 'each item must have a requested_qty integer >= 1' });
    }
  }

  const db = getDb();
  const skus = items.map(i => i.sku);
  const placeholders = skus.map(() => '?').join(',');
  const rows = db.prepare(
    `SELECT sku, stock_qty FROM products WHERE sku IN (${placeholders})`
  ).all(...skus);

  const bysku = Object.fromEntries(rows.map(r => [r.sku, r]));

  const results = items.map(({ sku, requested_qty }) => {
    const row = bysku[sku];
    if (!row) {
      return { sku, stock_level: 'out_of_stock', stock_qty: 0, requested_qty, available: false };
    }
    const level = stockLevel(row.stock_qty);
    const available = row.stock_qty >= requested_qty;
    return { sku, stock_level: level, stock_qty: row.stock_qty, requested_qty, available };
  });

  res.json({ results, has_unavailable: results.some(r => !r.available) });
});

// GET /api/catalog/products/:sku
router.get('/products/:sku', (req, res) => {
  const db = getDb();
  const row = db.prepare(`
    SELECT p.*, c.name AS category_name, b.name AS brand_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    JOIN brands     b ON b.id = p.brand_id
    WHERE p.sku = ?
  `).get(req.params.sku);

  if (!row) return res.status(404).json({ error: 'Product not found' });

  const compat = db.prepare(
    'SELECT model FROM product_compatibility WHERE product_id = ? ORDER BY model'
  ).all(row.id).map(r => r.model);

  res.json({ ...formatProduct(row), description: row.description, compatibility: compat });
});

// GET /api/catalog/products/:sku/stock
router.get('/products/:sku/stock', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT sku, stock_qty FROM products WHERE sku = ?').get(req.params.sku);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  const level = stockLevel(row.stock_qty);
  res.json({ sku: row.sku, stock_level: level, stock_qty: row.stock_qty, available: level !== 'out_of_stock' });
});

// GET /api/catalog/categories
router.get('/categories', (req, res) => {
  const db = getDb();
  res.json(db.prepare('SELECT id, name FROM categories ORDER BY name').all());
});

module.exports = router;
