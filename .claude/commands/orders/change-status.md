---
description: Cambia stato di un ordine
---

Prima di procedere, leggi cell-orders/CELL.md.

Cambia stato: $ARGUMENTS (formato: "ORDER_ID NUOVO_STATO")

Transizioni valide: pending→confirmed→shipped→delivered / pending|confirmed→cancelled
shipped/delivered: non cancellabili.
