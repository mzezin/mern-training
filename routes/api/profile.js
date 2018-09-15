const express = require('express');
const passport = require('passport');

const router = express.Router();

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET /api/profile/test
// @desc    Test users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile test' }));

// @route   GET /api/profile
// @desc    Current user profile route
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(500).json(err));
});

// @route   POST /api/profile
// @desc    Creatr\e user profile route
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
