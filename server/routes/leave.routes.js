const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Request leave (employee creates a leave request) — ADMIN or EMPLOYEE
router.post('/', authMiddleware, requireRole('ADMIN', 'EMPLOYEE'), async (req, res) => {
  try {
    const { employeeId, startDate, endDate, reason, type } = req.body;

    // Employees can only request leave for themselves
    if (req.user.role === 'EMPLOYEE' && req.user.employeeId !== parseInt(employeeId)) {
      return res.status(403).json({ error: 'Forbidden: you can only request leave for yourself' });
    }

    const leave = await prisma.leave.create({
      data: {
        employeeId: parseInt(employeeId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        type: type || 'casual'
      }
    });
    res.json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all leave requests — scoped
router.get('/', authMiddleware, async (req, res) => {
  const where = req.user.role === 'ADMIN'
    ? {}
    : { employee: { vendorId: req.user.vendorId } };

  const leaves = await prisma.leave.findMany({
    where,
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(leaves);
});

// Get leave requests for a specific employee — scoped
router.get('/employee/:employeeId', authMiddleware, async (req, res) => {
  const employeeId = parseInt(req.params.employeeId);

  const where = req.user.role === 'ADMIN'
    ? { employeeId }
    : { employeeId, employee: { vendorId: req.user.vendorId } };

  const leaves = await prisma.leave.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { employee: true }
  });
  res.json(leaves);
});

// Approve or reject a leave request — ADMIN or VENDOR only
router.put('/:id/status', authMiddleware, requireRole('ADMIN', 'VENDOR'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body; // "approved" or "rejected"

    const where = req.user.role === 'ADMIN'
      ? { id }
      : { id, employee: { vendorId: req.user.vendorId } };

    const leave = await prisma.leave.update({
      where,
      data: {
        status,
        approvedBy: req.user.id
      }
    });
    res.json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a leave request — scoped
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const where = req.user.role === 'ADMIN'
      ? { id }
      : { id, employee: { vendorId: req.user.vendorId } };

    await prisma.leave.delete({ where });
    res.json({ message: 'Leave request deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
