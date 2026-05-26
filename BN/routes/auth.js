const express = require('express');
const { requireAuth } = require('../middleware/auth');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /api/auth/me — returns current user (requires Supabase JWT)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: req.user.supabaseId },
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    });
    res.json({ user: dbUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
