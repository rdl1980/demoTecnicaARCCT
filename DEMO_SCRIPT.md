# DEMO SCRIPT — AgriParts Cell Architecture
### "Gli agenti AI senza confini diventano ingestibili"

> **Durata**: 8-10 minuti | **Pubblico**: misto tecnico e business
> **Setup richiesto**: progetto avviato (`npm run dev`), terminale visibile, browser aperto su localhost:5200

---

## Prima di iniziare — Setup silenzioso

Esegui questi comandi prima che arrivi il pubblico:

```powershell
# 1. Avvia tutto
npm run dev

# 2. Resetta i DB allo stato di demo (se necessario)
npm run db:seed

# 3. Apri il browser su localhost:5200
# Aggiungi al carrello UN prodotto out_of_stock (CAT-00004 o CAT-00009)
# così lo scenario 2 funziona immediatamente

# 4. Tieni aperto il file MONOLITH_ANTI_PATTERN.md nel tuo editor
```

---

## Apertura (1 minuto)

**[Mostra il browser con l'app aperta]**

> *"Questo è AgriParts — un e-commerce di pezzi di ricambio per macchine agricole. Ha due domini: il catalogo prodotti e la gestione degli ordini. Semplice. Ma il problema non è l'applicazione — è come ci lavoriamo con l'AI."*

**[Apri `MONOLITH_ANTI_PATTERN.md` nell'editor]**

> *"Questo è l'approccio classico. Un unico file di istruzioni per Claude Code — 487 token — con le regole del catalogo, le regole degli ordini, gli schema del database, le API, i seed. Tutto mescolato. Ogni volta che un agente lavora su qualsiasi parte del progetto, si porta dietro tutto questo contesto. Metà del quale è irrilevante."*

> *"Il risultato? L'agente modifica i file sbagliati, non sa distinguere le responsabilità, e più il progetto cresce più diventa ingestibile. Oggi vi mostro l'alternativa."*

**[Pausa di 2 secondi. Chiudi il file anti-pattern.]**

---

## Scenario 1 — L'agente nel suo dominio (3 minuti)

**[Apri Claude Code nel terminale principale]**

> *"Nel nostro progetto ogni dominio è una Cell. La Cell ha il suo database, il suo backend, e soprattutto le sue istruzioni per l'agente. Quando Claude Code apre questo progetto, carica il CLAUDE.md root — architettura generale, 90 token."*

**[Mostra `CLAUDE.md` root — scorrilo velocemente]**

> *"Poi, quando entro nella Cell del catalogo, carica automaticamente altri due file: il CLAUDE.md della Cell e il CELL.md con il dominio DDD. Guardiamo quanto contesto carica questo agente rispetto al monolite."*

**[Esegui nel terminale]**

```bash
node scripts/token-stats.js
```

**[Output atteso — qualcosa tipo:]**
```
  🔴 Approccio monolitico
     Contesto per OGNI agente:   ~487 token
     Rumore cross-dominio:        alto

  🟢 Cell Architecture
     catalog-agent:  ~280 token  (risparmio 43%)
     orders-agent:   ~260 token  (risparmio 47%)
     hld-agent:      ~420 token  (lettura intenzionale, è il suo ruolo)
```

> *"Il catalog-agent lavora con 280 token di contesto puro sul suo dominio. Il 43% di token in meno non è solo efficienza — è precisione. L'agente sa esattamente cosa può e non può fare."*

**[Ora lancia il comando di feature]**

```
/catalog:feature
Aggiungi il campo peso_kg al prodotto, visibile nel dettaglio prodotto
```

**[Mentre il catalog-lead lavora, mostra il terminale]**

> *"Guardate cosa fa prima di scrivere una riga di codice: legge il CELL.md del catalogo, il contratto OpenAPI, lo schema del DB, le route esistenti. Poi produce un piano strutturato — DB, backend, frontend — e chiede approvazione prima di toccare un singolo file."*

**[Quando arriva il piano e la richiesta di approvazione]**

> *"Eccolo: il piano dice che servono modifiche su tre layer. Approvo, e il lead dispatcha tre sub-agenti in parallelo — uno per il DB, uno per il backend, uno per il frontend. Ognuno riceve solo il contesto del suo layer."*

**[Quando appaiono i hook PostToolUse nel terminale]**

```
✅ [AgriParts] cell-catalog/db/schema.sql | Cell: cell-catalog
✅ [AgriParts] cell-catalog/backend/routes/catalog.js | Cell: cell-catalog
✅ [AgriParts] frontend/src/catalog/ProductDetail.jsx | Cell: cell-catalog
```

> *"Ogni file che tocca mostra la sua Cell di appartenenza. Tre agenti, tre layer, zero uscite dal dominio."*

**[Mostra il browser aggiornato con il nuovo prodotto nel catalogo]**

---

## Scenario 2 — Il confine (2 minuti)

**[Rimani nello stesso terminale Claude Code]**

> *"Stesso agente, stesso contesto. Adesso chiedo qualcosa fuori dal suo dominio."*

**[Digita nel terminale]**

```
Cambia lo stato dell'ordine #3 in "shipped"
```

**[Attendi la risposta dell'agente — dovrebbe rifiutare]**

> *[Leggi ad alta voce la risposta dell'agente, che dovrebbe dire qualcosa tipo: "Non sono in grado di gestire ordini. Il mio dominio è esclusivamente cell-catalog/. Per operazioni sugli ordini usa hld-agent per un'analisi cross-Cell."]*

> *"Ecco il punto. Non è disciplina del developer che ha scritto il codice. È architettura. L'agente non può sbagliare Cell perché non ha le informazioni per farlo. Non conosce il database degli ordini, non conosce le API degli ordini, non conosce le regole di business degli ordini."*

**[Per il pubblico business]**

> *"Questo vuol dire che se domani un nuovo sviluppatore usa questo progetto con Claude Code, è fisicamente impossibile che un agente del catalogo rompa la gestione degli ordini. Il confine non è una nota nel README — è nel sistema."*

**[Bonus: mostra il blocco checkout — 30 secondi]**

**[Apri il browser, vai al carrello che contiene un prodotto out_of_stock, clicca Checkout]**

> *"Stesso principio nell'app. La SPA, prima di fare checkout, chiama il catalogo per verificare lo stock. Se trova un prodotto non disponibile, blocca tutto e lo evidenzia. Due Cell che collaborano senza conoscersi — l'orchestrazione la fa la SPA, non le Cell."*

---

## Scenario 3 — Feature cross-Cell: HLD Agent + Cell Agent autonomi (4 minuti)

> *"Fin qui abbiamo visto agenti che lavorano su una Cell. Ma nella vita reale le feature toccano più domini. Come si gestisce senza rompere i confini?"*

**[Nel terminale principale — oppure un terzo terminale]**

> *"Usiamo l'HLD Agent. Il suo ruolo è solo uno: leggere tutto il progetto e produrre un piano. Non scrive codice, non modifica file."*

```
/hld
Voglio che quando un cliente fa checkout, l'app verifichi che ogni
prodotto nel carrello abbia stock sufficiente per la quantità richiesta
(non solo che sia in_stock, ma che la qty richiesta <= stock disponibile)
```

**[Mentre l'agente elabora]**

> *"L'HLD agent sta leggendo i CELL.md di entrambi i domini e i contratti OpenAPI. Sta capendo quale Cell deve cambiare e cosa."*

**[Quando arriva l'output del piano — leggi i punti chiave ad alta voce]**

L'output atteso dal piano HLD:

```
### Cell impattate
- cell-catalog: MODIFICA — aggiungere qty_requested al request body
  di /stock-check, rispondere con sufficient: boolean
- cell-orders: NESSUNA MODIFICA — la logica resta nella SPA

### Modifiche al contratto OpenAPI
- cell-catalog/contracts/catalog-api.yaml
  POST /api/catalog/products/stock-check
  Modifica request: aggiungere { sku, qty_requested } per ogni item
  Modifica response: aggiungere sufficient: boolean in StockStatus

### Flusso SPA
1. SPA chiama POST /api/catalog/products/stock-check con SKU + quantità
2. Se sufficient: false su almeno un item → blocca checkout, mostra errore
3. Altrimenti → chiama POST /api/orders/checkout

### Checklist
- [ ] cell-catalog: modifica stock-check per accettare qty_requested
- [ ] cell-orders: nessuna modifica
- [ ] SPA: aggiorna logica pre-checkout con il nuovo campo
```

> *"Il piano è pronto. Il catalog-lead analizza il piano e dispatcha i sub-agenti necessari in parallelo."*

**[Nel terminale principale — lancia la feature]**

```
/catalog:feature
Implementa la modifica descritta nel piano HLD:
aggiorna POST /api/catalog/products/stock-check per accettare
qty_requested per ogni SKU e rispondere con sufficient: boolean
```

> *"Il catalog-lead legge il piano, identifica i layer impattati — backend e frontend — e lancia backend-developer e frontend-developer in parallelo. Ognuno riceve solo il contesto del suo layer."*

**[Mostra i hook PostToolUse mentre i sub-agenti scrivono]**

```
✅ [AgriParts] cell-catalog/backend/routes/catalog.js | Cell: cell-catalog
✅ [AgriParts] cell-catalog/contracts/catalog-api.yaml | Cell: cell-catalog
✅ [AgriParts] frontend/src/shared/CartWidget.jsx | Cell: cell-catalog
```

> *"Guardate: tutto in `cell-catalog`. Il contratto OpenAPI è aggiornato contestualmente al backend — perché vive dentro la Cell, non in una cartella separata. Cell Orders non è stata toccata."*

---

## Chiusura (30 secondi)

**[Torna al browser, mostra l'app funzionante]**

> *"Stesso modello AI, stesso terminale, stesso repository. Quello che cambia è il contesto. Ogni agente ha il contesto del suo dominio — non di tutto il progetto. Il risultato è un sistema in cui l'AI lavora come i vostri team migliori: autonomia nel proprio pezzo, rispetto dei confini degli altri."*

> *"Il concetto si chiama Cell Architecture. Ogni Cell ha il suo CELL.md, il suo contratto OpenAPI, il suo agente. Scala con il progetto. Scala con il team. E non richiede disciplina — richiede struttura."*

---

## Gestione domande frequenti

**"Ma se cambio il contratto OpenAPI, come si aggiornano le Cell?"**
> *"L'HLD agent identifica i contratti da aggiornare nel piano. Poi ogni Cell Agent implementa il suo lato del contratto in autonomia. Il contratto è il confine — aggiorni il confine prima di implementare."*

**"Si può applicare a progetti già esistenti?"**
> *"Sì, è un processo incrementale. Si parte identificando i bounded context già presenti nel codice — spesso esistono già, solo non sono esplicitati. Si crea un CELL.md per dominio, un contratto OpenAPI per le API esistenti, e si introduce l'agente Cell per Cell."*

**"Quante Cell può avere un progetto?"**
> *"Dipende dal progetto. La regola pratica: una Cell per bounded context DDD. Se il tuo team ha un squad dedicato a un dominio, probabilmente merita una Cell. AgriParts ne ha due — un e-commerce reale ne avrebbe 5-8."*

**"Il token saving è reale o è solo una stima?"**
> *"Lo script che abbiamo visto legge i file reali del progetto e conta i caratteri. La stima è conservativa — in produzione il risparmio è maggiore perché il CLAUDE.md monolitico cresce con il progetto, mentre ogni CELL.md rimane focalizzato."*

---

## Checklist pre-demo

- [ ] `npm run dev` avviato, tutti e 3 i server attivi
- [ ] `npm run db:seed` eseguito per DB in stato demo pulito
- [ ] Browser aperto su localhost:5200
- [ ] Carrello con almeno un prodotto `out_of_stock` per Scenario 2
- [ ] Due terminali affiancati pronti per Scenario 3
- [ ] `MONOLITH_ANTI_PATTERN.md` aperto nell'editor per l'apertura
- [ ] `node scripts/token-stats.js` testato — output verificato
- [ ] Font caricati nel browser (controlla che Barlow Condensed sia visibile)
