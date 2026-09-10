const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Submit an expense (employee creates a claim) — ADMIN or EMPLOYEE
router.post('/', authMiddleware, requireRole('ADMIN', 'EMPLOYEE'), async (req, res) => {
  try {
    const { employeeId, title, amount, category, description } = req.body;

    // Employees can only submit for themselves
    if (req.user.role === 'EMPLOYEE' && req.user.employeeId !== parseInt(employeeId)) {
      return res.status(403).json({ error: 'Forbidden: you can only submit your own expenses' });
    }

    // Vendors cannot submit directly — handled via employees
    if (req.user.role === 'VENDOR') {
      return res.status(403).json({ error: 'Forbidden: vendors cannot submit expenses directly' });
    }

    const expense = await prisma.expense.create({
      data: {
        employeeId: parseInt(employeeId),
        title,
        amount: parseFloat(amount),
        category: category || 'general',
        description
      }
    });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all expenses — scoped
router.get('/', authMiddleware, async (req, res) => {
  const where = req.user.role === 'ADMIN'
    ? {}
    : { employee: { vendorId: req.user.vendorId } };

  const expenses = await prisma.expense.findMany({
    where,
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(expenses);
});

// Get expenses for a specific employee — scoped
router.get('/employee/:employeeId', authMiddleware, async (req, res) => {
  const employeeId = parseInt(req.params.employeeId);

  const where = req.user.role === 'ADMIN'
    ? { employeeId }
    : { employeeId, employee: { vendorId: req.user.vendorId } };

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { employee: true }
  });
  res.json(expenses);
});

// Approve/reject/reimburse an expense — ADMIN or VENDOR only
router.put('/:id/status', authMiddleware, requireRole('ADMIN', 'VENDOR'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body; // "approved", "rejected", "reimbursed"

    const where = req.user.role === 'ADMIN'
      ? { id }
      : { id, employee: { vendorId: req.user.vendorId } };

    const expense = await prisma.expense.update({
      where,
      data: {
        status,
        approvedBy: req.user.id
      }
    });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an expense — scoped
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const where = req.user.role === 'ADMIN'
      ? { id }
      : { id, employee: { vendorId: req.user.vendorId } };

    await prisma.expense.delete({ where });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
