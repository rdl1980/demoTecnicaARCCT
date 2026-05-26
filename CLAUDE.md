# CLAUDE.md

## Principles

1. **Think before coding** — State assumptions explicitly, ask when ambiguous, propose the simplest alternative.
2. **Minimum necessary** — No unrequested features, no single-use abstractions, no error handling for impossible scenarios.
3. **Surgical changes** — Touch only what's needed. Don't improve adjacent code. Every changed line must trace to a requirement.
4. **Verifiable success criteria** — Before implementing, define how you'll verify it works.

## Commands

```bash
npm run install:all   # install dependencies everywhere
npm run db:init       # create DB schema (once)
npm run db:seed       # populate with demo data
npm run dev           # start everything (catalog :3001, orders :3002, frontend :5200)
npm run token-stats   # compare token usage monolith vs cell
```

No test suite configured.

## Architecture

**Cell-based** demo for an agricultural parts e-commerce (AgriParts).  
Each cell = isolated vertical slice with its own DB, backend, and API contract.  
Cells never call each other — the React SPA orchestrates across them.

```
cell-catalog/   → port 3001  (products, stock, categories)
cell-orders/    → port 3002  (cart, orders, statuses)
frontend/       → port 5200  (React + Vite)
scripts/        → DB init/seed
```

**Stack per cell**: Express · SQLite (Node 22 DatabaseSync, no ORM) · OpenAPI 3.0 YAML  
**Prices**: integer cents · **Vite Proxy**: `/api/catalog` → :3001, `/api/orders` → :3002

**Key rule**: The SPA calls `POST /api/catalog/products/stock-check` before checkout. Cells do not cross-validate.

> Cell domain details: see `.github/instructions/cell-catalog.instructions.md` and `cell-orders.instructions.md`
