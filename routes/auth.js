
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const { isAuthenticated } = require('../controllers/authController');
const db = new PrismaClient();
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: { username:username, password: hashedPassword,  }
  });

    res.json({ msg: 'User registered', user: user[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username);
  try {
    const user = await db.user.findUnique({ 
      where: { username: username } 
    });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
    console.log('User found:', user.username);
    console.log(user)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      id: user.id,
      username: user.username
    };
    // Sign JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});    

// test route
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),         
  (req, res) => {
    res.json({ msg: 'You are authorized', user: req.user });
  }
);


router.get('/current', isAuthenticated, (req, res) => {
  res.json({ msg: "Authenticated"})
})



module.exports = router;
