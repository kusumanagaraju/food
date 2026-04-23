const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 0 },
  address: { type: String, required: true },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);
