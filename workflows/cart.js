import { proxyActivities, setHandler, condition } from '@temporalio/workflow';

const { processPayment, saveOrder } = proxyActivities({
  startToCloseTimeout: '1 minute'
});

export async function cartWorkflow(customerId, catalog) {
  const cart = [];
  let checkoutRequested = false;

  setHandler('addItem', (itemId, qty = 1) => {
    const item = catalog[itemId];
    if (!item) {
      throw new Error(`Unknown item ${itemId}`);
    }
    cart.push({ ...item, qty });
  });

  setHandler('getCart', () => cart);

  setHandler('checkout', () => {
    checkoutRequested = true;
  });

  await condition(() => checkoutRequested);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  await processPayment(total);
  await saveOrder({ customerId, items: cart, total });

  return 'Order completed';
}
