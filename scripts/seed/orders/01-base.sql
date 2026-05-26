-- Cell: orders
-- Seed data: 3 orders for demo-user
-- Order 3 pending contains CAT-00004 which is out_of_stock in catalog (demo scenario)

-- Order 1: delivered, 2 lines
INSERT INTO orders (id, customer_id, status, total_cents, created_at, updated_at) VALUES
  (1, 'demo-user', 'delivered', 27390, datetime('now', '-15 days'), datetime('now', '-10 days'));

INSERT INTO order_lines (order_id, sku, product_name, quantity, unit_price_cents, discount_pct, final_price_cents) VALUES
  (1, 'CAT-00001', 'Filtro olio motore SAME Explorer 3', 2, 2490, NULL, 2490),
  (1, 'CAT-00008', 'Filtro idraulico Fendt Vario',       3, 7470, NULL, 7470);

-- Order 2: shipped, 1 line
INSERT INTO orders (id, customer_id, status, total_cents, created_at, updated_at) VALUES
  (2, 'demo-user', 'shipped', 8900, datetime('now', '-5 days'), datetime('now', '-2 days'));

INSERT INTO order_lines (order_id, sku, product_name, quantity, unit_price_cents, discount_pct, final_price_cents) VALUES
  (2, 'CAT-00002', 'Cinghia distribuzione Deutz-Fahr', 1, 8900, NULL, 8900);

-- Order 3: pending, 2 lines — one SKU is out_of_stock (CAT-00004) for checkout-block demo
INSERT INTO orders (id, customer_id, status, total_cents, created_at, updated_at) VALUES
  (3, 'demo-user', 'pending', 43400, datetime('now', '-1 days'), datetime('now', '-1 days'));

INSERT INTO order_lines (order_id, sku, product_name, quantity, unit_price_cents, discount_pct, final_price_cents) VALUES
  (3, 'CAT-00004', 'Iniettore carburante John Deere 6R', 1, 18900, NULL, 18900),
  (3, 'CAT-00006', 'Pompa idraulica SAME Dorado',        1, 34500, NULL, 34500);
