const express = require('express');
const multer = require('multer');
const Product = require('../models/products-model');

const router = express.Router();

// Memory Storage for Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to add a new product
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const { name, price, discount } = req.body || {};

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Create a new product with the uploaded image
    const newProduct = new Product({
      image: req.file.buffer,
      name,
      price,
      discount,
      picture: req.file.originalname, // Save the original filename (optional)
    });

    await newProduct.save();
      req.flash('success','Product added successfully');
      res.redirect('/owners/admin');
   // res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

module.exports = router;
