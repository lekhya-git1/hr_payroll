const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');

// Request leave (employee creates a leave request)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { employeeId, startDate, endDate, reason, type } = req.body;
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

// Get all leave requests
router.get('/', authMiddleware, async (req, res) => {
  const leaves = await prisma.leave.findMany({
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(leaves);
});

// Get leave requests for a specific employee
router.get('/employee/:employeeId', authMiddleware, async (req, res) => {
  const leaves = await prisma.leave.findMany({
    where: { employeeId: parseInt(req.params.employeeId) },
    orderBy: { createdAt: 'desc' }
  });
  res.json(leaves);
});

// Approve or reject a leave request
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    const leave = await prisma.leave.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status,
        approvedBy: req.user.id // taken from the logged-in user's token
      }
    });
    res.json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a leave request
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.leave.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Leave request deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;