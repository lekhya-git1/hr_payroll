const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// Configure where and how files are saved
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Upload a document — ADMIN or VENDOR only
router.post('/', authMiddleware, requireRole('ADMIN', 'VENDOR'), upload.single('file'), async (req, res) => {
  try {
    const { employeeId, title } = req.body;

    // Vendors can only upload for their own employees
    if (req.user.role !== 'ADMIN') {
      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(employeeId) }
      });
      if (!employee || employee.vendorId !== req.user.vendorId) {
        return res.status(403).json({ error: 'Forbidden: employee not in your vendor' });
      }
    }

    const document = await prisma.document.create({
      data: {
        employeeId: parseInt(employeeId),
        title,
        fileName: req.file.originalname,
        filePath: req.file.filename,
        fileType: req.file.mimetype
      }
    });
    res.json(document);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all documents — scoped
router.get('/', authMiddleware, async (req, res) => {
  const where = req.user.role === 'ADMIN'
    ? {}
    : { employee: { vendorId: req.user.vendorId } };

  const documents = await prisma.document.findMany({
    where,
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(documents);
});

// Get documents for a specific employee — scoped
router.get('/employee/:employeeId', authMiddleware, async (req, res) => {
  const employeeId = parseInt(req.params.employeeId);

  const where = req.user.role === 'ADMIN'
    ? { employeeId }
    : { employeeId, employee: { vendorId: req.user.vendorId } };

  const documents = await prisma.document.findMany({ where });
  res.json(documents);
});

// Delete a document — scoped
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const where = req.user.role === 'ADMIN'
      ? { id }
      : { id, employee: { vendorId: req.user.vendorId } };

    await prisma.document.delete({ where });
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
