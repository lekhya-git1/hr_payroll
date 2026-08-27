const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Create a vendor
router.post('/', async (req, res) => {
  try {
    const vendor = await prisma.vendor.create({ data: req.body });
    res.json(vendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all vendors
router.get('/', async (req, res) => {
  const vendors = await prisma.vendor.findMany();
  res.json(vendors);
});

module.exports = router;