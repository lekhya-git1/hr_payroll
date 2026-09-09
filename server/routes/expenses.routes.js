const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');

// Submit an expense (employee creates a claim)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { employeeId, title, amount, category, description } = req.body;
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

// Get all expenses
router.get('/', authMiddleware, async (req, res) => {
  const expenses = await prisma.expense.findMany({
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(expenses);
});

// Get expenses for a specific employee
router.get('/employee/:employeeId', authMiddleware, async (req, res) => {
  const expenses = await prisma.expense.findMany({
    where: { employeeId: parseInt(req.params.employeeId) },
    orderBy: { createdAt: 'desc' }
  });
  res.json(expenses);
});

// Approve/reject/reimburse an expense
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body; // "approved", "rejected", "reimbursed"
    const expense = await prisma.expense.update({
      where: { id: parseInt(req.params.id) },
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

// Delete an expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.expense.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;