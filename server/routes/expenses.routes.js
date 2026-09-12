const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Submit an expense — EMPLOYEE only (for themselves)
router.post('/', authMiddleware, requireRole('EMPLOYEE'), async (req, res) => {
  try {
    const { title, amount, category, description } = req.body;

    const expense = await prisma.expense.create({
      data: {
        employeeId: req.user.employeeId, // force to their own ID
        title,
        amount: parseFloat(amount),
        category: category || 'general',
        description,
        status: 'pending'
      }
    });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all expenses — VENDOR sees all, EMPLOYEE sees only their own
router.get('/', authMiddleware, requireRole('VENDOR', 'EMPLOYEE'), async (req, res) => {
  const where = req.user.role === 'VENDOR'
    ? { employee: { vendorId: req.user.vendorId } }
    : { employeeId: req.user.employeeId };

  const expenses = await prisma.expense.findMany({
    where,
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(expenses);
});

// Approve/reject/reimburse an expense — VENDOR only
router.put('/:id/status', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body; // "approved", "rejected", "reimbursed"

    const existing = await prisma.expense.findUnique({
      where: { id },
      include: { employee: true }
    });
    if (!existing || existing.employee.vendorId !== req.user.vendorId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: { status, approvedBy: req.user.id }
    });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an expense — VENDOR only (scoped to their vendor)
router.delete('/:id', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.expense.findUnique({
      where: { id },
      include: { employee: true }
    });
    if (!existing || existing.employee.vendorId !== req.user.vendorId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.expense.delete({ where: { id } });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
