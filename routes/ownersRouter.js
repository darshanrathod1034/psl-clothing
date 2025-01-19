const express = require('express');
const owner = express.Router();
const ownerModel = require('../models/owners-model');

// Middleware to parse JSON
owner.use(express.json());

// Route to load Owners page
owner.get('/', (req, res) => {
  res.send('Owners page is loaded');
});

// Delete owner by email
owner.delete('/delete', async (req, res) => {
  try {
    let owner = await ownerModel.findOneAndDelete({ email: req.body.email });
    if (owner) {
      return res.status(200).send('Owner deleted successfully');
    } else {
      return res.status(404).send('Owner not found');
    }
  } catch (err) {
    res.status(500).send('Error deleting owner: ' + err.message);
  }
});

// Create a new owner
owner.post('/create', async (req, res) => {
  try {
    let owner = await ownerModel.find();
    if (owner.size>=1) {
      return res.status(503).send('Owner is already created you are not permetted to create another one');
    } else {
      // Add logic to create a new owner
      let { fullname, email, password } = req.body;
      let createdOwner = await ownerModel.create({
        fullname,
        email,
        password,
      });
      return res.status(201).send(createdOwner);
    }
  } catch (err) {
    res.status(500).send('Error creating owner: ' + err.message);
  }
});

module.exports = owner;

