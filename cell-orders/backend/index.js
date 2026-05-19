// Cell: orders — Express server porta 3002
const express = require('express');
const cors    = require('cors');
const ordersRouter = require('./routes/orders');

const app  = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use('/api/orders', ordersRouter);

app.listen(PORT, () => {
  console.log(`[cell-orders] listening on http://localhost:${PORT}`);
});
