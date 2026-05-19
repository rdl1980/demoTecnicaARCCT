// scripts/init-db.js
// Initializes and seeds both Cell databases

const { DatabaseSync } = require('node:sqlite');
const path     = require('path');
const fs       = require('fs');

function initCell(cellName, dbRelPath, schemaRelPath, seedRelPath) {
  const root    = path.join(__dirname, '..');
  const dbPath  = path.join(root, dbRelPath);
  const schemaPath = path.join(root, schemaRelPath);
  const seedPath   = path.join(root, seedRelPath);

  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log(`[${cellName}] removed existing DB`);
  }

  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');

  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  console.log(`[${cellName}] schema applied`);

  const seed = fs.readFileSync(seedPath, 'utf8');
  db.exec(seed);
  console.log(`[${cellName}] seed applied`);

  db.close();
  console.log(`[${cellName}] DB ready at ${dbPath}\n`);
}

console.log('AgriParts — initializing databases\n');

initCell(
  'cell-catalog',
  'cell-catalog/db/catalog.db',
  'cell-catalog/db/schema.sql',
  'cell-catalog/db/seed.sql'
);

initCell(
  'cell-orders',
  'cell-orders/db/orders.db',
  'cell-orders/db/schema.sql',
  'cell-orders/db/seed.sql'
);

console.log('All databases initialized successfully.');
