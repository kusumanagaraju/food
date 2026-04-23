const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
router.post('/', protect, authorize('Admin'), async (req, res) => {
  try {
    const { name, rating, address, imageUrl } = req.body;
    const restaurant = new Restaurant({ name, rating, address, imageUrl });
    const createdRestaurant = await restaurant.save();
    res.status(201).json(createdRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const { name, rating, address, imageUrl } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
      restaurant.name = name || restaurant.name;
      restaurant.rating = rating || restaurant.rating;
      restaurant.address = address || restaurant.address;
      restaurant.imageUrl = imageUrl || restaurant.imageUrl;

      const updatedRestaurant = await restaurant.save();
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      await restaurant.deleteOne();
      res.json({ message: 'Restaurant removed' });
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
