const express = require('express');
const user = express.Router();

user.get('/', (req, res) => {
  res.send('Users page is loaded');
  console.log('i amm runnniiinnng');
});

module.exports = user;
