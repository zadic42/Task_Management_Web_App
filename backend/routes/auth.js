const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  // Dummy user, no real check
  const token = jwt.sign({ username }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router; 