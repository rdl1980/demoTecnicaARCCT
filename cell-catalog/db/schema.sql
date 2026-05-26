-- Cell: catalog
-- Database schema for Catalog Cell

CREATE TABLE IF NOT EXISTS categories (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS brands (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  sku         TEXT    NOT NULL UNIQUE,
  name        TEXT    NOT NULL,
  description TEXT,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  brand_id    INTEGER NOT NULL REFERENCES brands(id),
  price_cents  INTEGER NOT NULL CHECK(price_cents > 0),
  discount_pct REAL    CHECK(discount_pct IS NULL OR (discount_pct >= 0.0 AND discount_pct <= 1.0)),
  stock_qty    INTEGER NOT NULL DEFAULT 0 CHECK(stock_qty >= 0),
  stock_level TEXT    NOT NULL DEFAULT 'out_of_stock'
                CHECK(stock_level IN ('in_stock','low_stock','out_of_stock'))
);

CREATE TABLE IF NOT EXISTS product_compatibility (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  model      TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand    ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_stock    ON products(stock_level);
CREATE INDEX IF NOT EXISTS idx_compat_product    ON product_compatibility(product_id);
