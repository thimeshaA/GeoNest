const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add country to favorites
router.post('/:countryCode', auth, async (req, res) => {
  try {
    const { countryCode } = req.params;
    const user = await User.findById(req.user._id);

    if (user.favorites.includes(countryCode)) {
      return res.status(400).json({ message: 'Country already in favorites' });
    }

    user.favorites.push(countryCode);
    await user.save();

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove country from favorites
router.delete('/:countryCode', auth, async (req, res) => {
  try {
    const { countryCode } = req.params;
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(code => code !== countryCode);
    await user.save();

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 