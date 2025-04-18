let products = [
  { id: 1, name: 'Tomatoes', price: 2.5 },
  { id: 2, name: 'Bananas', price: 1.8 },
  { id: 3, name: 'Carrots', price: 1.2 }
];

let orders = [];

function renderProducts() {
  const grid = document.getElementById('productGrid');
  const select = document.getElementById('productSelect');
  grid.innerHTML = '';
  select.innerHTML = '';

  products.forEach(product => {
    // Display card
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `<h3>${product.name}</h3><p>$${product.price}/kg</p>`;
    grid.appendChild(div);

    // Dropdown for ordering
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = product.name;
    select.appendChild(option);
  });

  renderInventory();
}

function placeOrder(e) {
  e.preventDefault();

  const productId = parseInt(document.getElementById('productSelect').value);
  const quantity = parseInt(document.getElementById('quantity').value);
  const name = document.getElementById('name').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const address = document.getElementById('address').value.trim();
  const product = products.find(p => p.id === productId);

  if (!quantity || !name || !contact || !address) return alert('Please complete all fields.');

  const order = {
    id: Date.now(),
    product: product.name,
    qty: quantity,
    name,
    contact,
    address,
    status: 'Pending'
  };

  orders.push(order);
  updateOrderStatus();
  renderAdminOrders();
  document.getElementById('orderForm').reset();
  alert(`✅ Order placed: ${quantity}kg ${product.name}`);
}

function updateOrderStatus() {
  const list = document.getElementById('orderList');
  list.innerHTML = orders.map(o => `
    <p>Order #${o.id}<br>${o.qty}kg ${o.product}<br>Status: <strong>${o.status}</strong></p>
  `).join('');
}

function renderAdminOrders() {
  const list = document.getElementById('adminOrderList');
  list.innerHTML = orders.map((o, i) => `
    <div class="admin-order">
      <p><strong>Order #${o.id}</strong><br>
      ${o.qty}kg ${o.product}<br>
      Name: ${o.name}<br>
      Contact: ${o.contact}<br>
      Address: ${o.address}<br>
      Status: 
      <select onchange="updateStatus(${i}, this.value)">
        <option ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
        <option ${o.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
        <option ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
      </select>
      </p>
    </div>
  `).join('');
}

function updateStatus(index, newStatus) {
  orders[index].status = newStatus;
  updateOrderStatus();
  renderAdminOrders();
}

function renderInventory() {
  const list = document.getElementById('inventoryList');
  list.innerHTML = '';
  products.forEach((p, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${p.name} - $${p.price}/kg 
      <button onclick="deleteProduct(${index})">❌</button>
    `;
    list.appendChild(li);
  });
}

function addProduct(e) {
  e.preventDefault();
  const name = document.getElementById('newProductName').value.trim();
  const price = parseFloat(document.getElementById('newProductPrice').value);
  if (!name || isNaN(price)) return alert('Enter valid product name and price.');

  products.push({ id: Date.now(), name, price });
  document.getElementById('inventoryForm').reset();
  renderProducts();
}

function deleteProduct(index) {
  if (confirm('Remove this product?')) {
    products.splice(index, 1);
    renderProducts();
  }
}

document.getElementById('orderForm').addEventListener('submit', placeOrder);
document.getElementById('inventoryForm').addEventListener('submit', addProduct);

renderProducts();
updateOrderStatus();
renderAdminOrders();
