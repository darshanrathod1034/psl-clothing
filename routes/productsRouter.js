const express = require('express');
const product = express.Router();

product.get('/', (req, res) => {
  res.send('Products page is loaded');
});

module.exports = product;
