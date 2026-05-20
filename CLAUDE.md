# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install all dependencies (root + all cells + frontend)
npm run install:all

# Initialize databases (run once after cloning)
npm run db:init

# Reset and re-seed databases
npm run db:seed

# Run everything concurrently (catalog :3001, orders :3002, frontend :5200)
npm run dev

# Run individual services
npm run dev:catalog
npm run dev:orders
npm run dev:frontend

# Compare token usage: monolith vs cell-based
npm run token-stats
```

No test suite is configured.

## Architecture

This is a **cell-based architecture** demo for an agricultural parts shop (AgriParts). The key idea: each "cell" is a fully isolated vertical slice with its own database, backend, and API contract. Cells never call each other — the React SPA orchestrates across cells.

```
cell-catalog/    → Product catalog cell (port 3001)
cell-orders/     → Cart & orders cell (port 3002)
frontend/        → React + Vite SPA (port 5200)
scripts/         → DB init/seed utilities
```

### Cells

Each cell (`cell-catalog/`, `cell-orders/`) has the same internal layout:
- `backend/index.js` — Express server entry point
- `backend/db.js` — SQLite connection (Node 22 `DatabaseSync`, no ORM)
- `backend/routes/` — Route handlers with raw SQL
- `contracts/*.yaml` — OpenAPI 3.0 contract (source of truth for the API)
- `db/schema.sql` + seed in `scripts/seed/<cell>/` — database definition
- `CELL.md` — domain documentation for this cell

SQLite runs in WAL mode with foreign keys enforced. All prices are stored as integer cents.

### Frontend

Vite proxies `/api/catalog` → `:3001` and `/api/orders` → `:3002`, so the SPA never hits cell ports directly in production-like usage. Stock validation (`POST /api/catalog/products/stock-check`) happens in the SPA before calling checkout — cells do not cross-validate.

### Cell boundaries

- `cell-catalog` owns: products, categories, brands, compatibility models, stock levels
- `cell-orders` owns: carts, cart items, orders, order lines, order status transitions
- The SPA passes product name + price into cart items at add-time (denormalized); orders cell has no dependency on catalog cell
