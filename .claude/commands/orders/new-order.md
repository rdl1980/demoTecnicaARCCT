---
description: Crea ordine di test per demo-user
---

Prima di procedere, leggi cell-orders/CELL.md e contracts/orders-api.yaml.

Crea ordine: $ARGUMENTS
Formato: "SKU:qty:prezzo_centesimi:nome_prodotto, ..."

Regole:
1. customer_id = demo-user
2. status = pending
3. price_snapshot = prezzo passato (non consultare cell-catalog)
