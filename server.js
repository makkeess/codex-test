import express from 'express';
import { Connection, Client } from '@temporalio/client';
import { v4 as uuidv4 } from 'uuid';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, 'public')));

const catalog = {
  apple: { name: 'Apple', price: 1 },
  banana: { name: 'Banana', price: 2 },
  carrot: { name: 'Carrot', price: 3 }
};

let connection;
let client;

async function getClient() {
  if (!client) {
    connection = await Connection.connect();
    client = new Client({ connection });
  }
  return client;
}

app.get('/items', (req, res) => {
  res.json(catalog);
});

app.post('/cart/create', async (req, res) => {
  const c = await getClient();
  const handle = await c.workflow.start('cartWorkflow', {
    args: [req.body.customerId ?? 'anonymous', catalog],
    taskQueue: 'checkout',
    workflowId: 'cart-' + uuidv4(),
  });
  res.json({ cartId: handle.workflowId });
});

app.post('/cart/:id/add', async (req, res) => {
  const c = await getClient();
  const handle = c.workflow.getHandle(req.params.id);
  await handle.signal('addItem', req.body.itemId, req.body.qty ?? 1);
  res.json({ ok: true });
});

app.get('/cart/:id', async (req, res) => {
  const c = await getClient();
  const handle = c.workflow.getHandle(req.params.id);
  const cart = await handle.query('getCart');
  res.json(cart);
});

app.post('/cart/:id/checkout', async (req, res) => {
  const c = await getClient();
  const handle = c.workflow.getHandle(req.params.id);
  await handle.signal('checkout');
  const result = await handle.result();
  res.json({ result });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
