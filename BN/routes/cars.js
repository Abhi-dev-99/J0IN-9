const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;
    let where = {};
    let orderBy = {};

    if (category && category !== 'All') where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (sortBy === 'price-asc') orderBy = { priceNum: 'asc' };
    else if (sortBy === 'price-desc') orderBy = { priceNum: 'desc' };
    else if (sortBy === 'hp') orderBy = { horsepower: 'desc' };
    else orderBy = { name: 'asc' };

    const cars = await prisma.car.findMany({ where, orderBy });
    res.json({ cars });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const cats = await prisma.car.findMany({ distinct: ['category'], select: { category: true } });
    res.json({ categories: ['All', ...cats.map(c => c.category)] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const car = await prisma.car.findUnique({ where: { carId: parseInt(req.params.id) } });
    if (!car) return res.status(404).json({ message: 'Not found' });
    res.json({ car });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
