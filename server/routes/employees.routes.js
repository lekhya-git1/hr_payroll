const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const vendorScope = require('../utils/scopeFilter');

// Create an employee — ADMIN or VENDOR only
router.post('/', authMiddleware, requireRole('ADMIN', 'VENDOR'), async (req, res) => {
  try {
    const vendorId = req.user.role === 'ADMIN'
      ? req.body.vendorId
      : req.user.vendorId;

    const employee = await prisma.employee.create({
      data: { ...req.body, vendorId }
    });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all employees — scoped
router.get('/', authMiddleware, async (req, res) => {
  const employees = await prisma.employee.findMany({
    where: vendorScope(req.user)
  });
  res.json(employees);
});

// Get one employee by id — scoped
router.get('/:id', authMiddleware, async (req, res) => {
  const where = req.user.role === 'ADMIN'
    ? { id: parseInt(req.params.id) }
    : { id: parseInt(req.params.id), vendorId: req.user.vendorId };

  const employee = await prisma.employee.findUnique({ where });
  res.json(employee);
});

// Update an employee — scoped
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const where = req.user.role === 'ADMIN'
      ? { id: parseInt(req.params.id) }
      : { id: parseInt(req.params.id), vendorId: req.user.vendorId };

    const employee = await prisma.employee.update({
      where,
      data: req.body
    });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an employee — scoped
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const where = req.user.role === 'ADMIN'
      ? { id: parseInt(req.params.id) }
      : { id: parseInt(req.params.id), vendorId: req.user.vendorId };

    await prisma.employee.delete({ where });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
