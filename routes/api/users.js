const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

let a;

const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');

const router = express.Router();

const User = require('../../models/User');

// @route   GET /api/users/test
// @desc    Test users route
// @access  Public

router.get('/test', (req, res) => res.json({ msg: 'Users test' }));

// @route   POST /api/users/register
// @desc    Create users route
// @access  Public

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  a = 1;
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      }
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        d: 'mm',
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });

      return newUser;
    });
});


// @route   GET /api/users/login
// @desc    Login User / Return token
// @access  Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .then((user) => {
      // Check user
      if (!user) {
        return res.status(404).json({ email: 'User not found' });
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            // User matched
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
            };
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => res.json({
                success: true,
                token: `Bearer: ${token}`,
              }),
            );
          } else {
            res.status(400).json({ password: 'Password incorrect' });
          }
        });
    });
});

// @route   GET /api/users/current
// @desc    Return current user
// @access  Private

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
});

module.exports = router;
