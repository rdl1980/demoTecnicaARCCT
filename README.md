# AgriParts — Cell Architecture Demo

A functional demo of **cell-based architecture** for an agricultural parts e-commerce. Each "cell" is a fully isolated vertical slice with its own database, backend, and OpenAPI 3.0 contract.

## 🎯 What is this project?

AgriParts demonstrates how to design scalable systems using the **Cell Pattern**:
- **Isolation**: Each cell has an independent database (SQLite)
- **Autonomy**: Cells never call each other directly; the frontend orchestrates across them
- **Explicit contracts**: OpenAPI 3.0 per cell defines the boundary
- **Intentional denormalization**: The frontend passes price/name into the cart; cell-orders has no dependency on catalog

## 📦 Architecture

```
cell-catalog/        → Product catalog (port 3001)
  ├── backend/
  │   ├── index.js
  │   ├── db.js (SQLite)
  │   └── routes/catalog.js
  ├── contracts/catalog-api.yaml
  └── db/schema.sql + seed

cell-orders/         → Cart & Orders (port 3002)
  ├── backend/
  │   ├── index.js
  │   ├── db.js (SQLite)
  │   └── routes/orders.js
  ├── contracts/orders-api.yaml
  └── db/schema.sql + seed

frontend/            → React + Vite SPA (port 5200)
  ├── src/
  │   ├── catalog/
  │   ├── orders/
  │   └── shared/
  └── vite.config.js

scripts/             → DB init/seed utilities
```

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- npm 10+

### Installation & Setup

```bash
# 1. Install dependencies (root + all cells + frontend)
npm run install:all

# 2. Initialize databases (run once)
npm run db:init

# 3. Populate databases with demo data
npm run db:seed

# 4. Start everything
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5200
- **Catalog API**: http://localhost:3001
- **Orders API**: http://localhost:3002

### Available commands

```bash
npm run install:all      # Install dependencies everywhere
npm run db:init          # Create database schemas
npm run db:seed          # Populate databases with seed data
npm run dev              # Start everything (catalog, orders, frontend)
npm run dev:catalog      # cell-catalog only
npm run dev:orders       # cell-orders only
npm run dev:frontend     # SPA frontend only
npm run token-stats      # Analyze token usage monolith vs cell
```

## 📚 Domain Structure

### Cell: Catalog (cell-catalog/)

Manages the product catalog with search, filters, and stock verification.

**Domain Model:**
- **Product**: Spare part with a unique SKU (format: CAT-XXXXX)
- **Category**: Logical grouping (Engine, Hydraulics, Transmission, Electrical, Body)
- **Brand**: Manufacturer (SAME, Deutz-Fahr, Fendt, John Deere, New Holland, Lamborghini Trattori)
- **Compatibility**: Machine models compatible with the product
- **StockLevel**: in_stock | low_stock (qty < 5) | out_of_stock (qty = 0)

**API Endpoints:**
```
GET    /api/catalog/products              # List products with filters
GET    /api/catalog/products/:sku         # Product details
GET    /api/catalog/categories            # Category list
GET    /api/catalog/products/:sku/stock   # Stock level
POST   /api/catalog/products/stock-check  # Batch pre-checkout stock check
```

**Cell Boundaries:**
- ✅ Owns: Products, categories, brands, compatibility, stock
- ❌ Does NOT own: Discounts, orders, cart, users, authentication

See [cell-catalog/CELL.md](cell-catalog/CELL.md) for details.

### Cell: Orders (cell-orders/)

Manages cart, checkout, and order lifecycle.

**Domain Model:**
- **Cart**: Temporary collection of CartItems per customer
- **CartItem**: SKU, quantity, price snapshot, product name
- **Order**: Confirmed and immutable cart
- **OrderLine**: Line item of a confirmed order
- **OrderStatus**: pending → confirmed → shipped → delivered (or cancelled)

**API Endpoints:**
```
GET    /api/orders/cart               # Get current cart
POST   /api/orders/cart/items         # Add product to cart
DELETE /api/orders/cart/items/:sku    # Remove from cart
POST   /api/orders/checkout           # Confirm and create order
GET    /api/orders                    # List customer orders
GET    /api/orders/:id                # Order details
PATCH  /api/orders/:id/status         # Update order status
```

**Business Rules:**
- Cart → Order only via checkout
- Price is frozen at order time (price_snapshot immutable)
- Cell does NOT validate stock; SPA calls catalog/stock-check before checkout
- Demo: customer_id = "demo-user"

**Cell Boundaries:**
- ✅ Owns: Cart, orders, status transitions
- ❌ Does NOT own: Catalog, search, product details, authentication

See [cell-orders/CELL.md](cell-orders/CELL.md) for details.

## 💾 Database

### cell-catalog/db/catalog.db
```sql
products              # SKU, name, description, price, category, brand
categories            # ID, name
brands                # ID, name
product_compatibility # Compatible machine models
```

### cell-orders/db/orders.db
```sql
carts                 # ID, customer_id, created_at
cart_items            # ID, cart_id, sku, quantity, unit_price
orders                # ID, customer_id, status, total, created_at
order_lines           # ID, order_id, sku, quantity, unit_price
```

All prices are **integer cents** (e.g. €19.99 = 1999 cents).

## 🔧 Technology Stack

- **Backend**: Express.js
- **Database**: SQLite 3 (Node 22 DatabaseSync, no ORM)
- **Frontend**: React 18 + Vite
- **API Spec**: OpenAPI 3.0 YAML
- **Runtime**: Node.js 22+

## 📋 Ongoing Requirements

### Feature: Product Discounts
- Add discount percentage as a product property
- Show original price, discount and final price at checkout
- Discount visibility in the catalog
- Persist as decimal

**Status**: Planned

## 🤝 How to Contribute

### Adding a feature

1. **Pick the cell** that owns it (catalog vs orders)
2. **Update the OpenAPI contract** in the cell: `contracts/*.yaml`
3. **Implement the backend** in the cell: `backend/routes/*.js`
4. **Update the schema** if needed: `db/schema.sql`
5. **Implement the frontend** in `frontend/src/`
6. **Test** by running `npm run dev` and verifying the end-to-end flow

### Change principles

- **One cell at a time**: Don't mix catalog and orders logic
- **Denormalize intentionally**: Pass data from the frontend to cells, don't cross-join cells
- **Explicit contracts**: Any API change must update the YAML
- **Manual testing**: No automated test suite; test via browser

### Pull Request workflow

```bash
# 1. Create a branch
git checkout -b feature/my-feature-name

# 2. Make changes following the principles above
# 3. Verify everything works
npm run dev

# 4. Commit with a descriptive message
git add .
git commit -m "feat(cell-orders): add discount snapshot to order lines"

# 5. Push and open PR
git push origin feature/my-feature-name
```

## 📖 Additional Documentation

- [cell-catalog/CELL.md](cell-catalog/CELL.md) — Catalog cell domain
- [cell-orders/CELL.md](cell-orders/CELL.md) — Orders cell domain
- [CLAUDE.md](CLAUDE.md) — Development guidelines
- OpenAPI: [cell-catalog/contracts/catalog-api.yaml](cell-catalog/contracts/catalog-api.yaml)
- OpenAPI: [cell-orders/contracts/orders-api.yaml](cell-orders/contracts/orders-api.yaml)

## 🔍 Token Usage Analytics

Compare token consumption between monolithic vs cell-based architecture:

```bash
npm run token-stats
```

## 📝 License

Demo project for educational and demonstration purposes.

---

**Maintained by**: AgriParts Development Team  
**Last updated**: May 2026
