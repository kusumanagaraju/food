const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Food = require('./models/Food');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cravings_db';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected...');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Food.deleteMany({});
    console.log('Cleared existing data.');

    // Add Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'Admin User',
      email: 'admin@cravings.com',
      password: adminPassword,
      role: 'Admin',
    });

    // Add Restaurants
    const r1 = await Restaurant.create({
      name: 'Spice Route',
      rating: 4.5,
      address: '123 Main St',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'
    });

    const r2 = await Restaurant.create({
      name: 'Burger Joint',
      rating: 4.2,
      address: '456 Oak Ave',
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800'
    });

    // Add Foods
    await Food.create([
      {
        name: 'Margherita Pizza',
        price: 299,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800',
        restaurantId: r1._id,
        category: 'Pizza',
        deliveryTime: '30 mins',
        discount: '20% OFF'
      },
      {
        name: 'Classic Cheeseburger',
        price: 199,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800',
        restaurantId: r2._id,
        category: 'Burger',
        deliveryTime: '25 mins',
        discount: ''
      },
      {
        name: 'Spicy Sushi Roll',
        price: 499,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800',
        restaurantId: r1._id,
        category: 'Sushi',
        deliveryTime: '40 mins',
        discount: '₹100 OFF'
      },
      {
        name: 'Masala Dosa',
        price: 120,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=800',
        restaurantId: r1._id,
        category: 'South Indian',
        deliveryTime: '20 mins',
        discount: ''
      }
    ]);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
