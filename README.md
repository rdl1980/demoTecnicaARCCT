# AgriParts — Pezzi di Ricambio per Macchine Agricole

E-commerce demo per illustrare la **Cell Architecture** con Claude Code.

## Avvio rapido

```bash
npm run install:all
npm run db:init
npm run dev
```

Apri http://localhost:5173

## Struttura

| Cell | Porta | Dominio |
|------|-------|---------|
| cell-catalog | 3001 | Catalogo prodotti, stock |
| cell-orders | 3002 | Carrello, ordini, checkout |
| frontend | 5173 | SPA React |

## Comandi utili

```bash
node scripts/token-stats.js   # Confronto token monolite vs Cell
npm run db:init               # Inizializza e popola i database
```

Vedi [PROJECT.md](PROJECT.md) per l'architettura completa.
