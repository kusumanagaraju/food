# CRAVINGS - Full-Stack Food Delivery Web Application

A production-ready food delivery platform built with a modern tech stack, clean architecture, and a premium aesthetic inspired by Zomato/Swiggy.

## 🚀 Technologies Used
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion, Zustand (State Management), React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens) with bcrypt
- **Icons**: Lucide React

## 📂 Folder Structure

```
/cravings
│
├── /frontend               # Next.js Application
│   ├── /public             # Static assets (images, icons)
│   ├── /src
│   │   ├── /app            # Next.js Pages (/, /login, /admin, /sub-admin)
│   │   ├── /components     # Reusable UI components (Navbar, FoodCard, CartDrawer)
│   │   ├── /context        # React Context (AuthContext)
│   │   └── /store          # Zustand store (useCartStore)
│   └── package.json        # Frontend dependencies
│
├── /backend                # Node.js/Express Application
│   ├── /models             # Mongoose schemas (User, Restaurant, Food, Order)
│   ├── /routes             # API routes
│   ├── /middleware         # JWT auth and role validation
│   ├── server.js           # Main Express server file
│   ├── seed.js             # Script to populate database with sample data
│   └── .env                # Environment variables
│
└── README.md               # This documentation
```

## 🔐 Role-Based Access Control
- **User**: Can browse restaurants/food, add to cart, place orders, and view own profile.
- **Sub-Admin**: Has read-only access to view all users and monitor incoming orders.
- **Admin**: Full control. Can add, edit, and delete Restaurants and Food items.

## 💻 How to Run Locally

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd cravings/backend
   ```
2. Ensure you have MongoDB running locally (or update the `.env` with an Atlas URI).
3. Install dependencies and seed the database:
   ```bash
   npm install
   node seed.js
   ```
4. Start the backend server:
   ```bash
   node server.js
   # Server runs on http://localhost:5000
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd cravings/frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   # App runs on http://localhost:3000
   ```

### 3. Test Accounts (Created by seed.js)
- **Admin Account**: Email: `admin@cravings.com` | Password: `admin123`
- You can create new User or Sub-Admin accounts directly from the Login/Sign Up page.

## 🚀 Deployment Guide
- **Frontend (Vercel)**: Push the `frontend` folder to GitHub. Import the repository into Vercel. Ensure the `NEXT_PUBLIC_API_URL` environment variable is set to your deployed backend URL.
- **Backend (Render/Railway)**: Push the `backend` folder to GitHub. Import into Render/Railway as a Node.js Web Service. Set environment variables: `PORT`, `MONGODB_URI`, and `JWT_SECRET`.
