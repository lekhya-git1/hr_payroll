const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Summary report: counts across the system — scoped
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    let totalEmployees, totalVendors, pendingLeaves, pendingExpenses, totalPayrollPaid;

    if (req.user.role === 'ADMIN') {
      totalEmployees = await prisma.employee.count();
      totalVendors = await prisma.vendor.count();
      pendingLeaves = await prisma.leave.count({ where: { status: 'pending' } });
      pendingExpenses = await prisma.expense.count({ where: { status: 'pending' } });
      const payrollAgg = await prisma.payroll.aggregate({
        _sum: { netPay: true },
        where: { status: 'paid' }
      });
      totalPayrollPaid = payrollAgg._sum.netPay || 0;
    } else {
      totalEmployees = await prisma.employee.count({ where: { vendorId: req.user.vendorId } });
      totalVendors = 1; // vendors only see themselves
      pendingLeaves = await prisma.leave.count({
        where: { status: 'pending', employee: { vendorId: req.user.vendorId } }
      });
      pendingExpenses = await prisma.expense.count({
        where: { status: 'pending', employee: { vendorId: req.user.vendorId } }
      });
      const payrollAgg = await prisma.payroll.aggregate({
        _sum: { netPay: true },
        where: { status: 'paid', employee: { vendorId: req.user.vendorId } }
      });
      totalPayrollPaid = payrollAgg._sum.netPay || 0;
    }

    res.json({
      totalEmployees,
      totalVendors,
      pendingLeaves,
      pendingExpenses,
      totalPayrollPaid
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Attendance report: present/absent counts per employee — scoped
router.get('/attendance', authMiddleware, async (req, res) => {
  try {
    const where = req.user.role === 'ADMIN'
      ? {}
      : { vendorId: req.user.vendorId };

    const employees = await prisma.employee.findMany({
      where,
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

// Payroll report: total paid per month — scoped
router.get('/payroll', authMiddleware, async (req, res) => {
  try {
    const where = req.user.role === 'ADMIN'
      ? {}
      : { employee: { vendorId: req.user.vendorId } };

    const payrolls = await prisma.payroll.findMany({
      where,
      include: { employee: true },
      orderBy: { month: 'desc' }
    });
    res.json(payrolls);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Vendor report: employee count per vendor — ADMIN only
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
