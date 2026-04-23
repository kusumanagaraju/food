const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const foodRoutes = require('./routes/food.routes');
const orderRoutes = require('./routes/order.routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Cravings API is running...');
});

const PORT = process.env.PORT || 5000;

// Since we are running this in a controlled environment, we can provide a default fallback MongoDB URI if none is set.
// Normally, this would just fail if no URI is provided.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cravings_db';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(`MongoDB Connected`);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  });
