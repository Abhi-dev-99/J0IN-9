const express = require('express');
const Car = require('../models/Car');

const router = express.Router();

// Get all cars
router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;
    let query = {};
    let sort = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search by name or brand
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    if (sortBy === 'price-asc') {
      sort = { priceNum: 1 };
    } else if (sortBy === 'price-desc') {
      sort = { priceNum: -1 };
    } else if (sortBy === 'hp') {
      sort = { horsepower: -1 };
    } else {
      sort = { name: 1 };
    }

    const cars = await Car.find(query).sort(sort);
    res.json({ cars });
  } catch (err) {
    console.error('Get cars error:', err);
    res.status(500).json({ message: 'Server error fetching cars' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Car.distinct('category');
    res.json({ categories: ['All', ...categories] });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// Get single car by id
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findOne({ id: parseInt(req.params.id) });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ car });
  } catch (err) {
    console.error('Get car error:', err);
    res.status(500).json({ message: 'Server error fetching car' });
  }
});

module.exports = router;
