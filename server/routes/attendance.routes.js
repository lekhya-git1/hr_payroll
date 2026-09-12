const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Mark attendance — VENDOR only
router.post('/', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    const { employeeId, status, checkIn } = req.body;

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) }
    });
    if (!employee || employee.vendorId !== req.user.vendorId) {
      return res.status(403).json({ error: 'Forbidden: employee not in your vendor' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: parseInt(employeeId),
        status: status || 'present',
        checkIn: checkIn ? new Date(checkIn) : new Date()
      }
    });
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all attendance — VENDOR sees their vendor's records, EMPLOYEE sees only their own
router.get('/', authMiddleware, requireRole('VENDOR', 'EMPLOYEE'), async (req, res) => {
  const where = req.user.role === 'VENDOR'
    ? { employee: { vendorId: req.user.vendorId } }
    : { employeeId: req.user.employeeId };

  const records = await prisma.attendance.findMany({
    where,
    include: { employee: true },
    orderBy: { date: 'desc' }
  });
  res.json(records);
});

// Get attendance for a specific employee — VENDOR only (scoped to their vendor)
router.get('/employee/:employeeId', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  const employeeId = parseInt(req.params.employeeId);

  const records = await prisma.attendance.findMany({
    where: { employeeId, employee: { vendorId: req.user.vendorId } },
    orderBy: { date: 'desc' }
  });
  res.json(records);
});

// Update attendance — VENDOR only
router.put('/:id', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.attendance.findUnique({
      where: { id },
      include: { employee: true }
    });
    if (!existing || existing.employee.vendorId !== req.user.vendorId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        status: req.body.status,
        checkOut: req.body.checkOut ? new Date(req.body.checkOut) : undefined
      }
    });
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete attendance — VENDOR only
router.delete('/:id', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.attendance.findUnique({
      where: { id },
      include: { employee: true }
    });
    if (!existing || existing.employee.vendorId !== req.user.vendorId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.attendance.delete({ where: { id } });
    res.json({ message: 'Attendance record deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;