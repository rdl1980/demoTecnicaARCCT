// scripts/seed-db.js
// Resets both Cell databases and applies seed files from scripts/seed/<cell>/
// Files are applied in alphabetical order — prefix with 01-, 02- to control sequence.

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs   = require('fs');

const ROOT = path.join(__dirname, '..');

const CELLS = [
  {
    name:      'cell-catalog',
    dbPath:    'cell-catalog/db/catalog.db',
    schema:    'cell-catalog/db/schema.sql',
    seedDir:   'scripts/seed/catalog',
  },
  {
    name:      'cell-orders',
    dbPath:    'cell-orders/db/orders.db',
    schema:    'cell-orders/db/schema.sql',
    seedDir:   'scripts/seed/orders',
  },
];

function seedCell({ name, dbPath, schema, seedDir }) {
  const absDb     = path.join(ROOT, dbPath);
  const absSchema = path.join(ROOT, schema);
  const absSeedDir = path.join(ROOT, seedDir);

  // Reset DB
  if (fs.existsSync(absDb))      fs.unlinkSync(absDb);
  if (fs.existsSync(absDb + '-shm')) fs.unlinkSync(absDb + '-shm');
  if (fs.existsSync(absDb + '-wal')) fs.unlinkSync(absDb + '-wal');
  console.log(`[${name}] DB reset`);

  const db = new DatabaseSync(absDb);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');

  // Apply schema
  db.exec(fs.readFileSync(absSchema, 'utf8'));
  console.log(`[${name}] schema applied`);

  // Apply seed files in alphabetical order
  const files = fs.readdirSync(absSeedDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log(`[${name}] no seed files found in ${seedDir}`);
  }

  for (const file of files) {
    db.exec(fs.readFileSync(path.join(absSeedDir, file), 'utf8'));
    console.log(`[${name}] applied ${path.join(seedDir, file)}`);
  }

  db.close();
  console.log(`[${name}] ready\n`);
}

console.log('AgriParts — seeding databases\n');
CELLS.forEach(seedCell);
console.log('Done.');
