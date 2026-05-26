const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const router = express.Router();

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true } });
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Auth failed' });
  }
};

router.get('/stats', requireAuth, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalCars = await prisma.car.count();
    const cats = await prisma.car.findMany({ distinct: ['category'], select: { category: true } });
    const breakdown = await prisma.car.groupBy({ by: ['category'], _count: { category: true } });
    const mostExpensive = await prisma.car.findFirst({ orderBy: { priceNum: 'desc' }, select: { name: true, price: true } });
    const mostPowerful = await prisma.car.findFirst({ orderBy: { horsepower: 'desc' }, select: { name: true, horsepower: true } });

    res.json({
      stats: {
        totalUsers, totalCars, totalCategories: cats.length,
        mostExpensive, mostPowerful
      },
      categoryBreakdown: breakdown.map(c => ({ category: c.category, count: c._count.category }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', requireAuth, async (req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, email: true, createdAt: true, updatedAt: true } });
    res.json({ users: users.map(u => ({ ...u, confirmed: true })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/cars', requireAuth, async (req, res) => {
  try {
    const cars = await prisma.car.findMany({ orderBy: { carId: 'asc' } });
    res.json({ cars });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
