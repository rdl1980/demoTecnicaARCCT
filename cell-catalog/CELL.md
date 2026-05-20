# Cell: Catalog — Catalogo Prodotti AgriParts

## Scopo
Gestisce l'intero ciclo di vita del catalogo prodotti: ricerca, navigazione,
dettaglio prodotto, disponibilità a magazzino, verifica stock batch.
NON gestisce prezzi promozionali, ordini, carrello o utenti.

## Linguaggio Ubiquo
- **Product**: pezzo di ricambio identificato da SKU univoco
- **Category**: raggruppamento logico (Motore, Idraulica, Trasmissione, Elettrica, Carrozzeria)
- **Brand**: produttore (SAME, Deutz-Fahr, Fendt, John Deere, New Holland, Lamborghini Trattori)
- **StockLevel**: in_stock | low_stock | out_of_stock
- **Compatibility**: lista modelli macchina compatibili con il prodotto

## Regole di Business
1. SKU formato obbligatorio: CAT-XXXXX (es. CAT-00123)
2. StockLevel: low_stock se qty < 5, out_of_stock se qty = 0
3. Un Product appartiene a una sola Category
4. Ricerca full-text su: nome, SKU, descrizione, brand, compatibility
5. Prezzo esposto = prezzo di listino in centesimi, senza sconti

## API Contract
Contratto completo: cell-catalog/contracts/catalog-api.yaml
Endpoint:
- GET  /api/catalog/products
- GET  /api/catalog/products/:sku
- GET  /api/catalog/categories
- GET  /api/catalog/products/:sku/stock
- POST /api/catalog/products/stock-check  ← verifica batch pre-checkout

## Dipendenze da altre Cell
NESSUNA. Questa Cell è autonoma.

## Cosa NON fare
- Non creare endpoint relativi a ordini o carrello
- Non leggere cell-orders/db/orders.db
- Non gestire scontistiche o autenticazione

## Database
File: cell-catalog/db/catalog.db
Tabelle: products, categories, brands, product_compatibility

## Note tecniche
- Express su porta 3001
- better-sqlite3, no ORM
- Importi in centesimi interi
