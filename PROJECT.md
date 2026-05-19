# AgriParts — Cell Architecture

## 1. Il problema: agenti senza confini

Apri `MONOLITH_ANTI_PATTERN.md`. Quello è l'approccio classico: un unico CLAUDE.md con ~487 token che mescola regole del catalogo, regole degli ordini, schema DB, API, seed. Ogni volta che un agente lavora su qualsiasi parte del progetto si porta dietro tutto quel contesto — metà del quale è irrilevante.

Il risultato:
- L'agente modifica file sbagliati perché "sa" di più di quanto dovrebbe
- Non distingue le responsabilità tra domini
- Cresce con il progetto: più feature aggiungi, più il CLAUDE.md monolitico peggiora

## 2. La soluzione: Cell Architecture

Ogni Cell è un'unità autonoma: ha il proprio DB, il proprio backend, il proprio `CELL.md` con le regole di dominio. Un agente che lavora su `cell-catalog` carica ~280 token di contesto puro, senza rumore cross-dominio.

Il risparmio non è solo di token: è di **precisione**, **affidabilità** e **controllo**. L'agente non può sbagliare Cell perché non ha le informazioni per farlo.

## 3. Diagramma architetturale

```
┌─────────────────────────────────────────────────────┐
│                  SPA React (porta 5173)              │
│         Orchestratore — chiama le Cell via HTTP      │
└──────────────────┬──────────────┬───────────────────┘
                   │              │
     pre-checkout: │              │
     stock-check   │              │
                   ▼              ▼
   ┌───────────────────┐  ┌───────────────────┐
   │   CELL CATALOG    │  │   CELL ORDERS     │
   │   porta 3001      │  │   porta 3002      │
   │                   │  │                   │
   │ CELL.md           │  │ CELL.md           │
   │ CLAUDE.md         │  │ CLAUDE.md         │
   │ catalog-api.yaml  │  │ orders-api.yaml   │
   │ catalog.db        │  │ orders.db         │
   └───────────────────┘  └───────────────────┘
           ▲                       ▲
           │                       │
   ┌───────────────┐       ┌───────────────┐
   │ catalog-agent │       │ orders-agent  │
   │ (solo cell-   │       │ (solo cell-   │
   │  catalog/)    │       │  orders/)     │
   └───────────────┘       └───────────────┘
           ▲                       ▲
           └───────────┬───────────┘
                       │
                ┌──────────────┐
                │  hld-agent   │
                │ (read-only   │
                │  su tutto)   │
                └──────────────┘
```

## 4. I contratti OpenAPI come confine fisico

`contracts/` è la frontiera esplicita tra le Cell. Nessuna Cell può usare l'altra senza un endpoint documentato. Se il contratto non prevede una funzionalità, quella funzionalità non esiste per le altre Cell.

Le Cell **non si chiamano mai direttamente** — è la SPA React l'unico orchestratore.

## 5. Come avviare

```bash
npm run install:all   # installa tutte le dipendenze
npm run db:init       # crea e popola i database SQLite
npm run dev           # avvia catalog (3001) + orders (3002) + frontend (5173)

node scripts/token-stats.js  # mostra il confronto token monolite vs Cell
```
