const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET || 'Ragh@9936';

// User Registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already exists.' });
    }
    res.status(500).json({ message: 'Error registering user.', error });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid username or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password.' });

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('authToken', token, { httpOnly: true });
    res.json({ token }); // Return the token in the response
    return res.redirect('/'); // Ensure redirection occurs after setting the cookie

  } catch (error) {
    res.status(500).json({ message: 'Error logging in.', error });
  }
});

// User Logout
router.get('/logout', (req, res) => {
  res.clearCookie('authToken');
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
