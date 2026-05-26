-- Cell: orders
-- Database schema for Orders Cell

CREATE TABLE IF NOT EXISTS carts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id TEXT NOT NULL UNIQUE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cart_items (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  cart_id           INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  sku               TEXT    NOT NULL,
  product_name      TEXT    NOT NULL,
  quantity          INTEGER NOT NULL CHECK(quantity > 0),
  unit_price_cents  INTEGER NOT NULL CHECK(unit_price_cents > 0),
  discount_pct      REAL,
  final_price_cents INTEGER,
  UNIQUE(cart_id, sku)
);

CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id TEXT    NOT NULL,
  status      TEXT    NOT NULL DEFAULT 'pending'
                CHECK(status IN ('pending','confirmed','shipped','delivered','cancelled')),
  total_cents INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_lines (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id          INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sku               TEXT    NOT NULL,
  product_name      TEXT    NOT NULL,
  quantity          INTEGER NOT NULL CHECK(quantity > 0),
  unit_price_cents  INTEGER NOT NULL CHECK(unit_price_cents > 0),
  discount_pct      REAL,
  final_price_cents INTEGER
);

CREATE INDEX IF NOT EXISTS idx_carts_customer    ON carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer   ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_lines_order ON order_lines(order_id);
