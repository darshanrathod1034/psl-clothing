const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const expresssession = require('express-session');
const flash = require('express-flash');

const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const index = require('./routes/index');

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser()); // Use cookie parser if needed

app.use(expresssession({
  secret: 'highhook',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(flash());

// Flash Messages Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.gologin = req.flash('gologin');
  next();
});

// View Engine
app.set('view engine', 'ejs');

// Routes
app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/', index);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/psl_clothings", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

connectDB();

// Global Error Handling
app.use((err, req, res, next) => {
  console.error("❌ Uncaught Error:", err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
