export async function fetchCart(customerId) {
  console.log('Fetching cart for', customerId);
  return { items: [], total: 42 };
}

export async function processPayment(amount) {
  console.log('Processing payment of', amount);
}

export async function saveOrder(cart) {
  console.log('Saving order', cart);
}
