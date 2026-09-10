const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Create a vendor — ADMIN only
router.post('/', authMiddleware, requireRole('ADMIN'), async (req, res) => {
  try {
    const vendor = await prisma.vendor.create({ data: req.body });
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all vendors — ADMIN only
router.get('/', authMiddleware, requireRole('ADMIN'), async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany();
    res.json(vendors);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
