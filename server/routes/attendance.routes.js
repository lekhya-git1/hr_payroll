const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');

// Mark attendance (check-in) for an employee
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { employeeId, status, checkIn } = req.body;
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

// Get all attendance records
router.get('/', authMiddleware, async (req, res) => {
  const records = await prisma.attendance.findMany({
    include: { employee: true }
  });
  res.json(records);
});

// Get attendance for a specific employee
router.get('/employee/:employeeId', authMiddleware, async (req, res) => {
  const records = await prisma.attendance.findMany({
    where: { employeeId: parseInt(req.params.employeeId) },
    orderBy: { date: 'desc' }
  });
  res.json(records);
});

// Update attendance (e.g. check-out time or status)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, checkOut } = req.body;
    const attendance = await prisma.attendance.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status,
        checkOut: checkOut ? new Date(checkOut) : undefined
      }
    });
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an attendance record
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.attendance.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Attendance record deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;