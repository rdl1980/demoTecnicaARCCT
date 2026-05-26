# CLAUDE.md

## Principi

1. **Pensa prima di scrivere** — Esplicita assunzioni, chiedi se è ambiguo, proponi l'alternativa più semplice.
2. **Minimo indispensabile** — Niente feature non richieste, niente astrazioni per uso singolo, niente error handling impossibili.
3. **Modifiche chirurgiche** — Tocca solo il necessario. Non migliorare codice adiacente. Ogni riga modificata deve tracciare al requisito.
4. **Criteri di successo verificabili** — Prima di implementare, definisci come verifichi che funzioni.

## Comandi

```bash
npm run install:all   # dipendenze ovunque
npm run db:init       # crea schema DB (una volta)
npm run db:seed       # popola con dati demo
npm run dev           # avvia tutto (catalog :3001, orders :3002, frontend :5200)
npm run token-stats   # confronto token monolith vs cell
```

No test suite configurata.

## Architettura

Demo **cell-based** per un e-commerce di ricambi agricoli (AgriParts).  
Ogni cell = slice verticale isolata con DB, backend e contratto API propri.  
Le cell non si chiamano mai — la SPA React orchestra tra di loro.

```
cell-catalog/   → port 3001  (prodotti, stock, categorie)
cell-orders/    → port 3002  (carrello, ordini, stati)
frontend/       → port 5200  (React + Vite)
scripts/        → init/seed DB
```

**Stack per ogni cell**: Express · SQLite (Node 22 DatabaseSync, no ORM) · OpenAPI 3.0 YAML  
**Prezzi**: centesimi interi · **Proxy Vite**: `/api/catalog` → :3001, `/api/orders` → :3002

**Regola chiave**: La SPA chiama `POST /api/catalog/products/stock-check` prima del checkout. Le cell non si cross-validano.

> Dettagli dominio per cell: vedi `.github/instructions/cell-catalog.instructions.md` e `cell-orders.instructions.md`
