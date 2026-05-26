// Cell: orders
const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

const CUSTOMER_ID = 'demo-user';

const VALID_TRANSITIONS = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['shipped',   'cancelled'],
  shipped:   ['delivered'],
  delivered: [],
  cancelled: [],
};

function getOrCreateCart(db) {
  let cart = db.prepare('SELECT * FROM carts WHERE customer_id = ?').get(CUSTOMER_ID);
  if (!cart) {
    const result = db.prepare('INSERT INTO carts (customer_id) VALUES (?)').run(CUSTOMER_ID);
    cart = { id: result.lastInsertRowid, customer_id: CUSTOMER_ID };
  }
  return cart;
}

function buildCartResponse(db, cart) {
  const items = db.prepare('SELECT * FROM cart_items WHERE cart_id = ?').all(cart.id);
  const total_cents = items.reduce((sum, i) => sum + i.quantity * (i.final_price_cents ?? i.unit_price_cents), 0);
  return { customer_id: CUSTOMER_ID, items, total_cents };
}

// GET /api/orders/cart
router.get('/cart', (req, res) => {
  const db = getDb();
  const cart = getOrCreateCart(db);
  res.json(buildCartResponse(db, cart));
});

// POST /api/orders/cart/items
router.post('/cart/items', (req, res) => {
  const { sku, product_name, quantity, unit_price_cents, discount_pct } = req.body;
  if (!sku || !product_name || !quantity || !unit_price_cents) {
    return res.status(400).json({ error: 'sku, product_name, quantity, unit_price_cents required' });
  }

  const db = getDb();
  const cart = getOrCreateCart(db);

  const existing = db.prepare('SELECT * FROM cart_items WHERE cart_id = ? AND sku = ?').get(cart.id, sku);
  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND sku = ?')
      .run(quantity, cart.id, sku);
  } else {
    const pct = (discount_pct != null) ? discount_pct : null;
    const final_price_cents = (pct != null)
      ? Math.round(unit_price_cents * (1 - pct))
      : unit_price_cents;
    db.prepare(
      'INSERT INTO cart_items (cart_id, sku, product_name, quantity, unit_price_cents, discount_pct, final_price_cents) VALUES (?,?,?,?,?,?,?)'
    ).run(cart.id, sku, product_name, quantity, unit_price_cents, pct, final_price_cents);
  }

  res.json(buildCartResponse(db, cart));
});

// DELETE /api/orders/cart/items/:sku
router.delete('/cart/items/:sku', (req, res) => {
  const db = getDb();
  const cart = getOrCreateCart(db);
  db.prepare('DELETE FROM cart_items WHERE cart_id = ? AND sku = ?').run(cart.id, req.params.sku);
  res.json(buildCartResponse(db, cart));
});

// POST /api/orders/checkout
router.post('/checkout', (req, res) => {
  const db = getDb();
  const cart = getOrCreateCart(db);
  const items = db.prepare('SELECT * FROM cart_items WHERE cart_id = ?').all(cart.id);

  if (items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const total_cents = items.reduce((sum, i) => sum + i.quantity * (i.final_price_cents ?? i.unit_price_cents), 0);

  let order;
  db.exec('BEGIN');
  try {
    const result = db.prepare(
      'INSERT INTO orders (customer_id, status, total_cents) VALUES (?,?,?)'
    ).run(CUSTOMER_ID, 'pending', total_cents);

    const orderId = Number(result.lastInsertRowid);
    for (const item of items) {
      db.prepare(
        'INSERT INTO order_lines (order_id, sku, product_name, quantity, unit_price_cents, discount_pct, final_price_cents) VALUES (?,?,?,?,?,?,?)'
      ).run(orderId, item.sku, item.product_name, item.quantity, item.unit_price_cents, item.discount_pct ?? null, item.final_price_cents ?? item.unit_price_cents);
    }

    db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cart.id);

    order = db.prepare(`
      SELECT o.*, COUNT(ol.id) AS items_count
      FROM orders o
      LEFT JOIN order_lines ol ON ol.order_id = o.id
      WHERE o.id = ?
      GROUP BY o.id
    `).get(orderId);
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

  const lines = db.prepare('SELECT * FROM order_lines WHERE order_id = ?').all(order.id);
  res.status(201).json({ ...order, lines });
});

// GET /api/orders
router.get('/', (req, res) => {
  const db = getDb();
  const orders = db.prepare(`
    SELECT o.id, o.status, o.total_cents, o.created_at,
           COUNT(ol.id) AS items_count
    FROM orders o
    LEFT JOIN order_lines ol ON ol.order_id = o.id
    WHERE o.customer_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `).all(CUSTOMER_ID);
  res.json(orders);
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const order = db.prepare(`
    SELECT o.id, o.status, o.total_cents, o.created_at,
           COUNT(ol.id) AS items_count
    FROM orders o
    LEFT JOIN order_lines ol ON ol.order_id = o.id
    WHERE o.id = ? AND o.customer_id = ?
    GROUP BY o.id
  `).get(req.params.id, CUSTOMER_ID);

  if (!order) return res.status(404).json({ error: 'Order not found' });

  const lines = db.prepare('SELECT * FROM order_lines WHERE order_id = ?').all(order.id);
  res.json({ ...order, lines });
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'status required' });

  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND customer_id = ?')
    .get(req.params.id, CUSTOMER_ID);

  if (!order) return res.status(404).json({ error: 'Order not found' });

  const allowed = VALID_TRANSITIONS[order.status] || [];
  if (!allowed.includes(status)) {
    return res.status(409).json({
      error: `Cannot transition from ${order.status} to ${status}`,
      allowed,
    });
  }

  db.prepare('UPDATE orders SET status = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .run(status, order.id);

  const updated = db.prepare(`
    SELECT o.id, o.status, o.total_cents, o.created_at,
           COUNT(ol.id) AS items_count
    FROM orders o
    LEFT JOIN order_lines ol ON ol.order_id = o.id
    WHERE o.id = ?
    GROUP BY o.id
  `).get(order.id);

  const lines = db.prepare('SELECT * FROM order_lines WHERE order_id = ?').all(order.id);
  res.json({ ...updated, lines });
});

module.exports = router;
