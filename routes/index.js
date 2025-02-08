const express = require('express');
const productModel = require('../models/products-model'); // Ensure this is correct
const isloggedin = require('../middlewares/isloggedin');
const usersModel = require('../models/users-model');
const index = express.Router();

// Route to load Owners page
index.get('/', (req, res) => {
  try {
    console.log('Rendering index.ejs');
    res.render('index');
  } catch (error) {
    console.error('Error rendering index.ejs:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

index.get('/cart/increase/:id',isloggedin, async(req, res) => {
  try{
    let user = await usersModel.findOne({ email: req.user.email });
    let cartItem = user.cart.find(item => item.productid && item.productid.toString() === req.params.id);
    cartItem.quantity++;
    await user.save();
    res.redirect('/cart');
    
  }
  catch(error){
    console.error(error);
    req.flash('error','Something went wrong');
    res.redirect('/cart');
  }
});
index.get('/cart/decrease/:id', isloggedin, async (req, res) => {
  try {
    let user = await usersModel.findOne({ email: req.user.email });

    let cartItem = user.cart.find(item => item.productid && item.productid.toString() === req.params.id);

    if (!cartItem) {
      req.flash('error', 'Item not found in cart');
      return res.redirect('/cart');
    }

    if (cartItem.quantity <= 1) {
      // Remove the item from the cart if quantity is 1 or less
      await usersModel.updateOne(
        { email: req.user.email },
        { $pull: { cart: { productid: req.params.id } } }
      );

      return res.redirect('/cart'); // Stop execution here after deletion
    }

    // Otherwise, decrease quantity
    cartItem.quantity--;
    await user.save();

    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong');
    res.redirect('/cart');
  }
});

index.get('/addtocart/:id', isloggedin, async (req, res) => {
  try {
      let user = await usersModel.findOne({ email: req.user.email });

     

      if (!user.cart) {
          user.cart = []; // Ensure cart is initialized
      }

      // Fix field name from `productId` to `productid`
      let cartItem = user.cart.find(item => item.productid && item.productid.toString() === req.params.id);

      if (cartItem) {
          cartItem.quantity++;
      } else {
          user.cart.push({ productid: req.params.id, quantity: 1 });
      }

      await user.save();

      req.flash('success', 'Product added to cart');
      res.redirect('/shop');
  } catch (error) {
      console.error(error);
      req.flash('error', 'Something went wrong');
      res.redirect('/shop');
  }
});




index.get('/cart', isloggedin, async (req, res) => {
  try {
      let user = await usersModel.findOne({ email: req.user.email }).populate('cart.productid');

      if (!user || !user.cart) {
          return res.render('cart', { user: [] }); // Handle case where user or cart is empty
      }

      const formattedUser = user.cart.map(item => ({
          _id: item.productid?._id || null, // Check if product exists
          name: item.productid?.name || 'Unknown Product',
          price: item.productid?.price || 0,
          discount: item.productid?.discount || 0,
          image: item.productid?.image ? item.productid.image.toString('base64') : null,
          bgcolor: '#f3f3f3', // Default background color
          panelcolor: '#000', // Default panel color
          textcolor: '#fff', // Default text color
          quantity: item.quantity || 1 // Ensure quantity is included
      }));

      res.render('cart', { user: formattedUser });
  } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).send('Internal Server Error');
  }
});


// Route to load Shop page
index.get('/shop',isloggedin, async (req, res) => {
  try {

    let success= req.flash('success');
      let sortOption = {};
      let sortby = req.query.sortby || ""; // Ensure sortby is always defined

      if (sortby === 'newest') {
          sortOption = { _id: -1 }; // Sort by newest products
      }

      const products = await productModel.find().sort(sortOption); // Use productModel

      // Convert image buffers to base64 for rendering
      const formattedProducts = products.map(product => ({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image ? product.image.toString('base64') : null,
          bgcolor: '#f3f3f3', // Default background color
          panelcolor: '#000', // Default panel color
          textcolor: '#fff' // Default text color
      }));

      res.render('shop', { products: formattedProducts, sortby,success }); // Ensure sortby is passed
  } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = index;