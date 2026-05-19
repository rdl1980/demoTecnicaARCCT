// Cell: catalog — Express server porta 3001
const express = require('express');
const cors    = require('cors');
const catalogRouter = require('./routes/catalog');

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/catalog', catalogRouter);

app.listen(PORT, () => {
  console.log(`[cell-catalog] listening on http://localhost:${PORT}`);
});
