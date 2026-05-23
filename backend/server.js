// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing of JSON request bodies

// In-memory "Database"
let products = [
  { id: 1, name: "Wireless Mouse", price: 29.99, category: "Electronics" },
  { id: 2, name: "Mechanical Keyboard", price: 89.99, category: "Electronics" },
  { id: 3, name: "Leather Journal", price: 15.50, category: "Stationery" }
];

// GET: Fetch all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// POST: Add a new product
app.post('/api/products', (req, res) => {
  const { name, price, category } = req.body;

  // Simple validation
  if (!name || !price || !category) {
    return res.status(400).json({ message: "All fields (name, price, category) are required." });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    category
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running smoothly on http://localhost:${PORT}`);
});