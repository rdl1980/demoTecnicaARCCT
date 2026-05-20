# AgriParts — Claude Code Memory

## Cell Architecture
Ogni dominio è un'unità autonoma con il proprio DB, backend e regole.
Le Cell comunicano solo tramite contratti OpenAPI. Ogni Cell espone il proprio contratto in <cell>/contracts/.

## Regola fondamentale
Prima di lavorare su una Cell, leggi il CELL.md della Cell specifica.
Non leggere i CELL.md delle altre Cell.

## Cell
| Cell            | Cartella       | Porta | Contratto                  |
|-----------------|----------------|-------|----------------------------|
| Catalogo        | cell-catalog/  | 3001  | cell-catalog/contracts/catalog-api.yaml |
| Gestione Ordini | cell-orders/   | 3002  | cell-orders/contracts/orders-api.yaml   |

## Comandi
- Avvia tutto:    npm run dev
- Init DB:        npm run db:init
- Token stats:    node scripts/token-stats.js

## Orchestrazione inter-Cell
Le Cell NON si chiamano direttamente.
La SPA è l'unico orchestratore.
Esempio: pre-checkout → SPA chiama catalog/stock-check → poi orders/checkout.

## Agenti disponibili
- hld-agent:     analisi cross-Cell, read-only, produce piano HLD
- catalog-agent: lavora solo in cell-catalog/
- orders-agent:  lavora solo in cell-orders/

## Ambiente utente
- OS: Windows — fornire sempre script PowerShell, mai comandi bash/sh

## Mai fare
- Leggere il DB di un'altra Cell
- Importare moduli da un'altra Cell
- Aggiungere logica di una Cell dentro un'altra
