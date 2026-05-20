---
description: Sviluppa una nuova feature per la Cell Catalogo. Mostra un piano e chiede approvazione prima di scrivere codice.
---

Gestisci questa feature request per la Cell Catalogo: $ARGUMENTS

## Fase 1 — Analisi (catalog-lead)

Usa il sub-agente `catalog-lead` passandogli la feature request e il percorso del progetto.
Il lead leggerà il contesto, scriverà un piano in `plans/` e lo restituirà.

## Fase 2 — Approvazione

Mostra il piano all'utente con `AskUserQuestion`. Presenta queste opzioni:
- **Procedi** — il piano va bene, dispatcha i sub-agenti
- **Modifica** — l'utente descriverà le modifiche, poi aggiorna il piano prima di procedere

Non procedere mai alla Fase 3 senza approvazione esplicita.

## Fase 3 — Sviluppo (sub-agenti in parallelo)

Leggi il piano approvato per determinare i layer impattati, poi dispatcha in parallelo
**solo** gli agenti necessari:

**db-developer** (se il piano include modifiche DB):
Prompt da iniettare:
- Task specifico dal piano
- Percorso Cell: `cell-catalog/db/`
- Schema attuale: contenuto di `cell-catalog/db/schema.sql`
- Regole business rilevanti da `cell-catalog/CELL.md`

**backend-developer** (se il piano include modifiche backend):
Prompt da iniettare:
- Task specifico dal piano
- Percorso Cell: `cell-catalog/backend/`
- Route esistente: contenuto di `cell-catalog/backend/routes/catalog.js`
- Schema DB aggiornato (dall'output del db-developer se è stato eseguito)
- Regole business rilevanti da `cell-catalog/CELL.md`

**frontend-developer** (se il piano include modifiche frontend):
Prompt da iniettare:
- Task specifico dal piano
- Componenti da modificare (path assoluti)
- Nuovi endpoint/campi disponibili (dall'output del backend-developer)
- Contratto API: sezione rilevante di `cell-catalog/contracts/catalog-api.yaml`

**Nota contratto:** Se il piano include modifiche al contratto OpenAPI, il backend-developer
deve aggiornare `cell-catalog/contracts/catalog-api.yaml` contestualmente alle route.

## Fase 4 — Report

Riporta all'utente:
- Cosa ha fatto ogni sub-agente
- File modificati
- Come testare la feature (`npm run dev`, endpoint da verificare)
