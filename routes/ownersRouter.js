const express = require('express');
const owner = express.Router();

owner.get('/', (req, res) => {
  res.send('Owners page is loaded');
});

module.exports = owner;
