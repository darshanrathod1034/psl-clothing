const express = require('express');
const index = express.Router();


// Middleware to parse JSON
index.use(express.json());

// Route to load Owners page
index.get('/shop', (req, res) => {
  let flash=req.flash('error');
  res.render('shop',{error:flash});
  // res.send('Owners page is loaded');
});


module.exports = index;

