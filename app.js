const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path=require('path');
const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser()); // Use cookie parser if needed

// MongoDB Connection
//const MONGO_URI = "mongodb+srv://darshanvipulkumarrathod81:CXCEUeSjZotxBgtc@cluster0.zhso0.mongodb.net/your_database_name";


app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);


mongoose.connect("mongodb://127.0.0.1:27017/psl_clothings")
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit if the connection fails
  });


// Routes
app.get('/', (req, res) => {
  res.send('<h1>WELCOME TO PSL CLOTHINGS </h1>');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
