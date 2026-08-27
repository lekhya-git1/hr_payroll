const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Create an employee
router.post('/', async (req, res) => {
  try {
    const employee = await prisma.employee.create({ data: req.body });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  const employees = await prisma.employee.findMany();
  res.json(employees);
});

// Get one employee by id
router.get('/:id', async (req, res) => {
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  res.json(employee);
});

// Update an employee
router.put('/:id', async (req, res) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    await prisma.employee.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;