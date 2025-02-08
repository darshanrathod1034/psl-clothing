const express = require('express');
const user = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/users-model');

const jwtSecret = process.env.JWT_SECRET || 'highhook';

user.get('/', (req, res) => {
  res.send('Users page is loaded');
});

user.post('/register', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).send('All input is required');
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash('error', 'User already exists');
      return res.redirect('/');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email: user.email, id: user._id }, jwtSecret);
    res.cookie('token', token);
    res.redirect('/login'); // Redirect to login after registration
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

user.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('All input is required');
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash('error', 'Email or password incorrect');
      return res.redirect('/');
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ email: user.email, id: user._id }, jwtSecret);
      res.cookie('token', token);
      return res.redirect('/shop'); // Corrected view name
    } else {
      return res.status(400).send('Email or password incorrect');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

user.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/'); // Redirect after logout
});

module.exports = user;
