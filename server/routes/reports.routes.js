const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Summary report — VENDOR only
router.get('/summary', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    const totalEmployees = await prisma.employee.count({ where: { vendorId: req.user.vendorId } });
    const pendingLeaves = await prisma.leave.count({
      where: { status: 'pending', employee: { vendorId: req.user.vendorId } }
    });
    const pendingExpenses = await prisma.expense.count({
      where: { status: 'pending', employee: { vendorId: req.user.vendorId } }
    });
    const payrollAgg = await prisma.payroll.aggregate({
      _sum: { netPay: true },
      where: { status: 'paid', employee: { vendorId: req.user.vendorId } }
    });

    res.json({
      totalEmployees,
      totalVendors: 1, // vendors only see themselves
      pendingLeaves,
      pendingExpenses,
      totalPayrollPaid: payrollAgg._sum.netPay || 0
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Attendance report — VENDOR only
router.get('/attendance', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      where: { vendorId: req.user.vendorId },
      include: { attendance: true }
    });

    const report = employees.map((emp) => ({
      employeeId: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      totalPresent: emp.attendance.filter((a) => a.status === 'present').length,
      totalAbsent: emp.attendance.filter((a) => a.status === 'absent').length
    }));

    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Payroll report — VENDOR only
router.get('/payroll', authMiddleware, requireRole('VENDOR'), async (req, res) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      where: { employee: { vendorId: req.user.vendorId } },
      include: { employee: true },
      orderBy: { month: 'desc' }
    });
    res.json(payrolls);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Vendor report — ADMIN only
router.get('/vendors', authMiddleware, requireRole('ADMIN'), async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: { employees: true }
    });

    const report = vendors.map((v) => ({
      vendorId: v.id,
      name: v.name,
      employeeCount: v.employees.length
    }));

    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
