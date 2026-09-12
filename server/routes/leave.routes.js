const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Request leave — VENDOR (for their employees) or EMPLOYEE (for themselves)
router.post('/', authMiddleware, requireRole('VENDOR', 'EMPLOYEE'), async (req, res) => {
  try {
    const { startDate, endDate, reason, type } = req.body;
    let { employeeId } = req.body;

    if (req.user.role === 'EMPLOYEE') {
      // Employees can only request leave for themselves — ignore any employeeId they send
      employeeId = req.user.employeeId;
    } else {
      // Vendor must be requesting for an employee in their own vendor
      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(employeeId) }
      });
      if (!employee || employee.vendorId !== req.user.vendorId) {
        return res.status(403).json({ error: 'Forbidden: employee not in your vendor' });
      }
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

// Get all leave requests — VENDOR sees their vendor's, EMPLOYEE sees only their own
router.get('/', authMiddleware, requireRole('VENDOR', 'EMPLOYEE'), async (req, res) => {
  const where = req.user.role === 'VENDOR'
    ? { employee: { vendorId: req.user.vendorId } }
    : { employeeId: req.user.employeeId };

  const leaves = await prisma.leave.findMany({
    where,
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(leaves);
});

// Get leave requests for a specific employee — VENDOR only (scoped to their vendor)
router.get('/employee/:employeeId', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  const employeeId = parseInt(req.params.employeeId);

  const leaves = await prisma.leave.findMany({
    where: { employeeId, employee: { vendorId: req.user.vendorId } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(leaves);
});

// Approve or reject a leave request — VENDOR only
router.put('/:id/status', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const existing = await prisma.leave.findUnique({
      where: { id },
      include: { employee: true }
    });
    if (!existing || existing.employee.vendorId !== req.user.vendorId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const leave = await prisma.leave.update({
      where: { id },
      data: { status, approvedBy: req.user.id }
    });
    res.json(leave);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete/cancel a leave request — VENDOR (any in their vendor) or EMPLOYEE (their own, if still pending)
router.delete('/:id', authMiddleware, requireRole('VENDOR', 'EMPLOYEE'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.leave.findUnique({
      where: { id },
      include: { employee: true }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (req.user.role === 'VENDOR' && existing.employee.vendorId !== req.user.vendorId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (req.user.role === 'EMPLOYEE') {
      if (existing.employeeId !== req.user.employeeId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      if (existing.status !== 'pending') {
        return res.status(400).json({ error: 'Cannot cancel a leave request that is already decided' });
      }
    }

    await prisma.leave.delete({ where: { id } });
    res.json({ message: 'Leave request deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;