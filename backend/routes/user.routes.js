const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const User = require('../models/User');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin or Sub-admin
router.get('/', protect, authorize('Admin', 'Sub-admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin or Sub-admin
router.get('/:id', protect, authorize('Admin', 'Sub-admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
