const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');

// Generate payroll for an employee for a given month
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { employeeId, month, totalWorkingDays } = req.body;

    // 1. Get the employee's base salary
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) }
    });
    if (!employee || !employee.salary) {
      return res.status(400).json({ error: 'Employee not found or has no salary set' });
    }

    // 2. Count how many days they were present in that month
    const [year, monthNum] = month.split('-');
    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        employeeId: parseInt(employeeId),
        date: { gte: startOfMonth, lte: endOfMonth },
        status: 'present'
      }
    });
    const daysPresent = attendanceRecords.length;

    // 3. Calculate pay
    const baseSalary = employee.salary;
    const grossPay = (baseSalary / totalWorkingDays) * daysPresent;
    const taxDeduction = grossPay * 0.10;
    const pfDeduction = grossPay * 0.12;
    const netPay = grossPay - taxDeduction - pfDeduction;

    // 4. Save the payroll record
    const payroll = await prisma.payroll.create({
      data: {
        employeeId: parseInt(employeeId),
        month,
        baseSalary,
        totalWorkingDays: parseInt(totalWorkingDays),
        daysPresent,
        grossPay,
        taxDeduction,
        pfDeduction,
        netPay
      }
    });

    res.json(payroll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all payroll records
router.get('/', authMiddleware, async (req, res) => {
  const payrolls = await prisma.payroll.findMany({
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(payrolls);
});

// Get payroll history for a specific employee
router.get('/employee/:employeeId', authMiddleware, async (req, res) => {
  const payrolls = await prisma.payroll.findMany({
    where: { employeeId: parseInt(req.params.employeeId) },
    orderBy: { month: 'desc' }
  });
  res.json(payrolls);
});

// Mark payroll as paid
router.put('/:id/pay', authMiddleware, async (req, res) => {
  try {
    const payroll = await prisma.payroll.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'paid' }
    });
    res.json(payroll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
