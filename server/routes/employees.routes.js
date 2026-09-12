const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Create an employee — VENDOR only
router.post('/', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    const employee = await prisma.employee.create({
      data: { ...req.body, vendorId: req.user.vendorId }
    });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all employees — VENDOR only, scoped to their own
router.get('/', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  const employees = await prisma.employee.findMany({
    where: { vendorId: req.user.vendorId }
  });
  res.json(employees);
});

// Get one employee by id — VENDOR only, scoped
router.get('/:id', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(req.params.id), vendorId: req.user.vendorId }
  });
  res.json(employee);
});

// Update an employee — VENDOR only, scoped
router.put('/:id', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: parseInt(req.params.id), vendorId: req.user.vendorId },
      data: req.body
    });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an employee — VENDOR only, scoped
router.delete('/:id', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    await prisma.employee.delete({
      where: { id: parseInt(req.params.id), vendorId: req.user.vendorId }
    });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;