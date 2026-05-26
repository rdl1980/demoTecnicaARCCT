# AgriParts — Cell Architecture Demo

Una demo funzionale di **architettura cell-based** per un e-commerce di ricambi agricoli. Ogni "cell" è una fetta verticale completamente isolata con il proprio database, backend e contratto API OpenAPI 3.0.

## 🎯 Cosa è questo progetto?

AgriParts dimostra come progettare sistemi scalabili usando il **Cell Pattern**:
- **Isolamento**: Ogni cell ha database indipendente (SQLite)
- **Autonomia**: Le cell non si chiamano mai direttamente; il frontend le orchiestra
- **Contratti espliciti**: OpenAPI 3.0 per ogni cell definisce il confine
- **Denormalizzazione intelligente**: Il frontend passa prezzo/nome nel carrello; la cell-orders non dipende da catalog

## 📦 Architettura

```
cell-catalog/        → Catalogo prodotti (porta 3001)
  ├── backend/
  │   ├── index.js
  │   ├── db.js (SQLite)
  │   └── routes/catalog.js
  ├── contracts/catalog-api.yaml
  └── db/schema.sql + seed

cell-orders/         → Carrello & Ordini (porta 3002)
  ├── backend/
  │   ├── index.js
  │   ├── db.js (SQLite)
  │   └── routes/orders.js
  ├── contracts/orders-api.yaml
  └── db/schema.sql + seed

frontend/            → React + Vite SPA (porta 5200)
  ├── src/
  │   ├── catalog/
  │   ├── orders/
  │   └── shared/
  └── vite.config.js

scripts/             → Utilità per init/seed database
```

## 🚀 Quick Start

### Prerequisiti
- Node.js 22+
- npm 10+

### Installazione e Setup

```bash
# 1. Installa dipendenze (root + tutte le cell + frontend)
npm run install:all

# 2. Inizializza i database (esegui una sola volta)
npm run db:init

# 3. Popola i database con dati demo
npm run db:seed

# 4. Avvia tutto in concorrenza
npm run dev
```

L'applicazione sarà disponibile su:
- **Frontend**: http://localhost:5200
- **Catalog API**: http://localhost:3001
- **Orders API**: http://localhost:3002

### Comandi disponibili

```bash
npm run install:all      # Installa dipendenze ovunque
npm run db:init          # Crea gli schema dei database
npm run db:seed          # Popola i database con seed
npm run dev              # Avvia tutto (catalog, orders, frontend)
npm run dev:catalog      # Solo cell-catalog
npm run dev:orders       # Solo cell-orders
npm run dev:frontend     # Solo SPA frontend
npm run token-stats      # Analizza token usage monolith vs cell
```

## 📚 Struttura Dominio

### Cell: Catalog (cell-catalog/)

Gestisce il catalogo prodotti con ricerca, filtri e verifiche di stock.

**Modello di Dominio:**
- **Product**: Pezzo di ricambio con SKU univoco (formato: CAT-XXXXX)
- **Category**: Raggruppamento logico (Motore, Idraulica, Trasmissione, Elettrica, Carrozzeria)
- **Brand**: Produttore (SAME, Deutz-Fahr, Fendt, John Deere, New Holland, Lamborghini Trattori)
- **Compatibility**: Modelli di macchina compatibili con il prodotto
- **StockLevel**: in_stock | low_stock (qty < 5) | out_of_stock (qty = 0)

**API Endpoints:**
```
GET    /api/catalog/products              # Lista prodotti con filtri
GET    /api/catalog/products/:sku         # Dettagli prodotto
GET    /api/catalog/categories            # Liste di categorie
GET    /api/catalog/products/:sku/stock   # Livello stock
POST   /api/catalog/products/stock-check  # Verifica batch pre-checkout
```

**Confini della Cell:**
- ✅ Gestisce: Prodotti, categorie, brand, compatibilità, stock
- ❌ Non gestisce: Sconti, ordini, carrello, utenti, autenticazione

Vedi [cell-catalog/CELL.md](cell-catalog/CELL.md) per dettagli.

### Cell: Orders (cell-orders/)

Gestisce carrello, checkout e ciclo di vita degli ordini.

**Modello di Dominio:**
- **Cart**: Raccolta temporanea di CartItem per customer
- **CartItem**: SKU, quantità, prezzo snapshot, nome prodotto
- **Order**: Carrello confermato e immutabile
- **OrderLine**: Riga di un ordine confermato
- **OrderStatus**: pending → confirmed → shipped → delivered (oppure cancelled)

**API Endpoints:**
```
GET    /api/orders/cart               # Recupera carrello attuale
POST   /api/orders/cart/items         # Aggiunge prodotto al carrello
DELETE /api/orders/cart/items/:sku    # Rimuove dal carrello
POST   /api/orders/checkout           # Conferma e crea ordine
GET    /api/orders                    # Lista ordini del customer
GET    /api/orders/:id                # Dettagli ordine
PATCH  /api/orders/:id/status         # Cambia stato ordine
```

**Regole di Business:**
- Il carrello → ordine solo tramite checkout
- Il prezzo è congelato al momento dell'ordine (price_snapshot immutabile)
- La cell NON valida stock; la SPA chiama catalog/stock-check prima del checkout
- Demo: customer_id = "demo-user"

**Confini della Cell:**
- ✅ Gestisce: Carrello, ordini, status
- ❌ Non gestisce: Catalogo, ricerca, dettagli prodotto, autenticazione

Vedi [cell-orders/CELL.md](cell-orders/CELL.md) per dettagli.

## 💾 Database

### cell-catalog/db/catalog.db
```sql
products              # SKU, nome, descrizione, prezzo, categoria, brand
categories            # ID, nome
brands                # ID, nome
product_compatibility # Modelli di macchina compatibili
```

### cell-orders/db/orders.db
```sql
carts                 # ID, customer_id, created_at
cart_items            # ID, cart_id, sku, quantity, unit_price
orders                # ID, customer_id, status, total, created_at
order_lines           # ID, order_id, sku, quantity, unit_price
```

Tutti i prezzi sono **interi in centesimi** (es: €19,99 = 1999 centesimi).

## 🔧 Technology Stack

- **Backend**: Express.js
- **Database**: SQLite 3 (Node 22 DatabaseSync, no ORM)
- **Frontend**: React 18 + Vite
- **API Spec**: OpenAPI 3.0 YAML
- **Runtime**: Node.js 22+

## 📋 Requisiti in Corso

### Feature: Sconti sui Prodotti
- Aggiungere percentuale di sconto come proprietà del prodotto
- Mostrare prezzo originale, sconto e prezzo finale al checkout
- Visibilità dello sconto nel catalogo
- Persistenza in decimali

**Status**: Pianificato

## 🤝 Come Contribuire

### Per aggiungere una feature

1. **Scegli la cell** che la contiene (catalog vs orders)
2. **Aggiorna il contratto OpenAPI** nella cell: `contracts/*.yaml`
3. **Implementa il backend** nella cell: `backend/routes/*.js`
4. **Aggiorna lo schema** se necessario: `db/schema.sql`
5. **Implementa il frontend** in `frontend/src/`
6. **Testa** avviando `npm run dev` e verificando il flusso end-to-end

### Principi per le modifiche

- **Una cell per volta**: Non mescolare logica di catalog e orders
- **Denormalizza intelligentemente**: Passa dati dal frontend alle cell, non fare join tra celle
- **Contatti espliciti**: Qualsiasi cambio API deve aggiornare lo YAML
- **Test manuale**: Non c'è suite di test automatici; testa via browser

### Workflow per Pull Request

```bash
# 1. Crea un branch
git checkout -b feature/nome-feature

# 2. Fai le modifiche seguendo i principi sopra
# 3. Verifica il funzionamento
npm run dev

# 4. Commit con messaggio descrittivo
git add .
git commit -m "feat(cell-orders): add discount snapshot to order lines"

# 5. Push e apri PR
git push origin feature/nome-feature
```

## 📖 Documentazione Aggiuntiva

- [cell-catalog/CELL.md](cell-catalog/CELL.md) — Dominio Catalog
- [cell-orders/CELL.md](cell-orders/CELL.md) — Dominio Orders
- [CLAUDE.md](CLAUDE.md) — Linee guida di sviluppo
- OpenAPI: [cell-catalog/contracts/catalog-api.yaml](cell-catalog/contracts/catalog-api.yaml)
- OpenAPI: [cell-orders/contracts/orders-api.yaml](cell-orders/contracts/orders-api.yaml)

## 🔍 Token Usage Analytics

Confronta il consumo di token tra architettura monolitica vs cell-based:

```bash
npm run token-stats
```

## 📝 Licenza

Demo per scopi educativi e dimostrativi.

---

**Mantenuto da**: AgriParts Development Team  
**Ultima modifica**: Maggio 2026
