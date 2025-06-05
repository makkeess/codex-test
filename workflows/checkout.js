import { proxyActivities } from '@temporalio/workflow';

const { fetchCart, processPayment, saveOrder } = proxyActivities({
  startToCloseTimeout: '1 minute'
});

export async function checkoutWorkflow(customerId) {
  const cart = await fetchCart(customerId);
  await processPayment(cart.total);
  await saveOrder(cart);
  return 'Order completed';
}
