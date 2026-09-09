const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');

// Summary report: counts across the whole system
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const totalEmployees = await prisma.employee.count();
    const totalVendors = await prisma.vendor.count();
    const pendingLeaves = await prisma.leave.count({ where: { status: 'pending' } });
    const pendingExpenses = await prisma.expense.count({ where: { status: 'pending' } });
    const totalPayrollPaid = await prisma.payroll.aggregate({
      _sum: { netPay: true },
      where: { status: 'paid' }
    });

    res.json({
      totalEmployees,
      totalVendors,
      pendingLeaves,
      pendingExpenses,
      totalPayrollPaid: totalPayrollPaid._sum.netPay || 0
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Attendance report: present/absent counts per employee
router.get('/attendance', authMiddleware, async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
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

// Payroll report: total paid per month
router.get('/payroll', authMiddleware, async (req, res) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: { employee: true },
      orderBy: { month: 'desc' }
    });
    res.json(payrolls);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Vendor report: employee count per vendor
router.get('/vendors', authMiddleware, async (req, res) => {
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