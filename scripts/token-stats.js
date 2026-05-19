// scripts/token-stats.js
// Confronto token: approccio monolitico vs Cell-Based
// Stima: 1 token ≈ 4 caratteri
//
// Monolite: ogni agente legge TUTTO (root + entrambe le Cell + entrambi i contratti)
// Cell Architecture: ogni agente legge SOLO il proprio dominio

const fs   = require('fs');
const path = require('path');

function tokens(filePath) {
  try { return Math.ceil(fs.readFileSync(filePath, 'utf8').length / 4); }
  catch { return 0; }
}

const r = path.join(__dirname, '..');

const claudeRoot      = tokens(path.join(r, 'CLAUDE.md'));
const catalogClaude   = tokens(path.join(r, 'cell-catalog/CLAUDE.md'));
const catalogCell     = tokens(path.join(r, 'cell-catalog/CELL.md'));
const catalogContract = tokens(path.join(r, 'contracts/catalog-api.yaml'));
const ordersClaude    = tokens(path.join(r, 'cell-orders/CLAUDE.md'));
const ordersCell      = tokens(path.join(r, 'cell-orders/CELL.md'));
const ordersContract  = tokens(path.join(r, 'contracts/orders-api.yaml'));

// Monolite: tutto il contesto caricato da ogni agente indiscriminatamente
const monolith = claudeRoot + catalogClaude + catalogCell + catalogContract
               + ordersClaude + ordersCell + ordersContract;

// Cell agent: solo il proprio dominio
const catalogContext = claudeRoot + catalogClaude + catalogCell + catalogContract;
const ordersContext  = claudeRoot + ordersClaude  + ordersCell  + ordersContract;

// HLD agent: legge tutto intenzionalmente (è il suo ruolo)
const hldContext = claudeRoot + catalogCell + ordersCell + catalogContract + ordersContract;

const pct = (n, tot) => Math.round((1 - n / tot) * 100);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  AgriParts — Token Context Comparison');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`  🔴 Approccio monolitico`);
console.log(`     Contesto per OGNI agente:   ~${monolith} token`);
console.log(`     (root + catalog + orders + entrambi i contratti)`);
console.log(`     Rumore cross-dominio:        alto`);
console.log('');
console.log(`  🟢 Cell Architecture`);
console.log(`     catalog-agent:  ~${catalogContext} token  (risparmio ${pct(catalogContext, monolith)}%)`);
console.log(`     orders-agent:   ~${ordersContext} token  (risparmio ${pct(ordersContext,  monolith)}%)`);
console.log(`     hld-agent:      ~${hldContext} token  (lettura intenzionale, è il suo ruolo)`);
console.log('');
console.log(`  ✅ Ogni Cell agent lavora con il contesto del solo suo dominio.`);
console.log(`     Il monolite carica ~${monolith} token per ogni agente, anche se`);
console.log(`     quasi metà è irrilevante per il task corrente.`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
