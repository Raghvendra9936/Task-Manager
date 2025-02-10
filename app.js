const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/users');
const Events = require('./models/events');

const app = express();
const JWT_SECRET = 'Ragh@9936'; // Ensure this is declared

// Database Connection
mongoose
  .connect('mongodb://localhost:27017/TaskManager', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Database connection error:', err));

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

// Authentication Middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect('/login');
  }
}

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});



// Register Route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ username: user.username, id: user._id }, 'Ragh@9936', { expiresIn: '1h' });
    res.cookie('authToken', token, { httpOnly: true });
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout Route
app.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logged out successfully' });
});

// Protected Home Route
app.get('/', authenticateToken, (req, res) => {
  res.render('home', { username: req.user.username });
});

// Event Routes
app.post('/events', (req, res) => {
  let event = req.body;
  Events.insertMany(event, (err, events) => {
    if (err) throw err;
    res.json(events);
  });
});

app.get('/events', (req, res) => {
  Events.find((err, events) => {
    if (err) throw err;
    res.json(events);
  });
});

app.delete('/events/:_id', (req, res) => {
  Events.remove({ _id: req.params._id }, (err, events) => {
    if (err) throw err;
    res.json(events);
  });
});

app.put('/events/:_id', (req, res) => {
  let event = req.body;
  let update = { '$set': { ...event } };
  Events.updateOne({ _id: req.params._id }, update, (err, events) => {
    if (err) throw err;
    res.json(events);
  });
});

app.use('*', function(req, res){
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});


// Catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
