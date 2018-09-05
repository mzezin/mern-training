const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

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

module.exports = router;
