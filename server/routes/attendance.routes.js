const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Mark attendance (check-in) for an employee — ADMIN or VENDOR only
router.post('/', authMiddleware, requireRole('ADMIN', 'VENDOR'), async (req, res) => {
  try {
    const { employeeId, status, checkIn } = req.body;

    // Vendors can only mark attendance for their own employees
    if (req.user.role !== 'ADMIN') {
      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(employeeId) }
      });
      if (!employee || employee.vendorId !== req.user.vendorId) {
        return res.status(403).json({ error: 'Forbidden: employee not in your vendor' });
      }
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

// Get all attendance records — scoped
router.get('/', authMiddleware, async (req, res) => {
  const where = req.user.role === 'ADMIN'
    ? {}
    : { employee: { vendorId: req.user.vendorId } };

  const records = await prisma.attendance.findMany({
    where,
    include: { employee: true }
  });
  res.json(records);
});

// Get attendance for a specific employee — scoped
router.get('/employee/:employeeId', authMiddleware, async (req, res) => {
  const employeeId = parseInt(req.params.employeeId);

  const where = req.user.role === 'ADMIN'
    ? { employeeId }
    : { employeeId, employee: { vendorId: req.user.vendorId } };

  const records = await prisma.attendance.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { employee: true }
  });
  res.json(records);
});

// Update attendance — scoped
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const where = req.user.role === 'ADMIN'
      ? { id }
      : { id, employee: { vendorId: req.user.vendorId } };

    const attendance = await prisma.attendance.update({
      where,
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

// Delete attendance — scoped
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const where = req.user.role === 'ADMIN'
      ? { id }
      : { id, employee: { vendorId: req.user.vendorId } };

    await prisma.attendance.delete({ where });
    res.json({ message: 'Attendance record deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
