const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const Food = require('../models/Food');

const router = express.Router();

// @desc    Get all food items
// @route   GET /api/foods
// @access  Public
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({}).populate('restaurantId', 'name');
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Admin
router.post('/', protect, authorize('Admin'), async (req, res) => {
  try {
    const { name, price, rating, image, restaurantId, category, deliveryTime, discount } = req.body;
    const food = new Food({ name, price, rating, image, restaurantId, category, deliveryTime, discount });
    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const { name, price, rating, image, restaurantId, category, deliveryTime, discount } = req.body;
    const food = await Food.findById(req.params.id);

    if (food) {
      food.name = name || food.name;
      food.price = price || food.price;
      food.rating = rating || food.rating;
      food.image = image || food.image;
      food.restaurantId = restaurantId || food.restaurantId;
      food.category = category || food.category;
      food.deliveryTime = deliveryTime || food.deliveryTime;
      food.discount = discount || food.discount;

      const updatedFood = await food.save();
      res.json(updatedFood);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      await food.deleteOne();
      res.json({ message: 'Food item removed' });
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
