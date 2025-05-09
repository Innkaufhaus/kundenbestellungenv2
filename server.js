const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// In-memory orders array
let orders = [];

// Load orders from file if exists
const ordersFile = path.join(__dirname, 'orders.json');
if (fs.existsSync(ordersFile)) {
  const data = fs.readFileSync(ordersFile);
  orders = JSON.parse(data);
}

// POST endpoint to create new order
app.post('/orders', (req, res) => {
  const order = req.body;
  if (!order.customerName || !order.status || !order.date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  order.id = orders.length + 1;
  orders.push(order);

  // Save orders to file
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

  res.status(201).json({ message: 'Order created', order });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
