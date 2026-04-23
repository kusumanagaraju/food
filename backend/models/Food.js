const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  image: { type: String, required: true },
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  category: { type: String, default: 'All' },
  deliveryTime: { type: String, default: '30 mins' },
  discount: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Food', FoodSchema);
