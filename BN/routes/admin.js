const express = require('express');
const supabase = require('../lib/supabase');
const Car = require('../models/Car');

const router = express.Router();

// Auth middleware
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = data.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Auth failed' });
  }
};

// Get dashboard stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    // Get users from Supabase
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    const totalUsers = usersError ? 0 : (usersData.users?.length || 0);

    // Get cars from MongoDB
    const totalCars = await Car.countDocuments();
    const categories = await Car.distinct('category');
    const categoryBreakdown = await Car.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Get most expensive car
    const mostExpensive = await Car.findOne().sort({ priceNum: -1 }).select('name price');

    // Get highest horsepower car
    const mostPowerful = await Car.findOne().sort({ horsepower: -1 }).select('name horsepower');

    res.json({
      stats: {
        totalUsers,
        totalCars,
        totalCategories: categories.length,
        mostExpensive: mostExpensive ? { name: mostExpensive.name, price: mostExpensive.price } : null,
        mostPowerful: mostPowerful ? { name: mostPowerful.name, horsepower: mostPowerful.horsepower } : null
      },
      categoryBreakdown: categoryBreakdown.map(c => ({
        category: c._id,
        count: c.count
      }))
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

// Get all users
router.get('/users', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const users = (data.users || []).map(u => ({
      id: u.id,
      email: u.email,
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at,
      confirmed: u.email_confirmed_at !== null
    }));

    res.json({ users });
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// Get all cars (admin view)
router.get('/cars', requireAuth, async (req, res) => {
  try {
    const cars = await Car.find().sort({ id: 1 });
    res.json({ cars });
  } catch (err) {
    console.error('Admin cars error:', err);
    res.status(500).json({ message: 'Server error fetching cars' });
  }
});

module.exports = router;
