let cartId = null;
let catalog = {};

async function fetchItems() {
  const res = await fetch('/items');
  catalog = await res.json();
  const itemsDiv = document.getElementById('items');
  itemsDiv.innerHTML = '';
  Object.entries(catalog).forEach(([id, item]) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<strong>${item.name}</strong> - $${item.price} ` +
      `<button data-id="${id}">Add</button>`;
    itemsDiv.appendChild(div);
  });
  itemsDiv.addEventListener('click', async (e) => {
    if (e.target.tagName === 'BUTTON') {
      await addToCart(e.target.dataset.id);
    }
  });
}

async function ensureCart() {
  if (!cartId) {
    const res = await fetch('/cart/create', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    cartId = data.cartId;
    document.getElementById('checkoutBtn').disabled = false;
  }
}

async function addToCart(itemId) {
  await ensureCart();
  await fetch(`/cart/${cartId}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId })
  });
  await refreshCart();
}

async function refreshCart() {
  if (!cartId) return;
  const res = await fetch(`/cart/${cartId}`);
  const cart = await res.json();
  const ul = document.getElementById('cartItems');
  ul.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.qty} - $${item.price * item.qty}`;
    ul.appendChild(li);
  });
}

async function checkout() {
  if (!cartId) return;
  const res = await fetch(`/cart/${cartId}/checkout`, { method: 'POST' });
  const data = await res.json();
  alert(data.result);
  cartId = null;
  document.getElementById('cartItems').innerHTML = '';
  document.getElementById('checkoutBtn').disabled = true;
}

window.onload = () => {
  fetchItems();
  document.getElementById('checkoutBtn').addEventListener('click', checkout);
};
