const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/auth');

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

// Upload a document
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { employeeId, title } = req.body;
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

// Get all documents
router.get('/', authMiddleware, async (req, res) => {
  const documents = await prisma.document.findMany({
    include: { employee: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(documents);
});

// Get documents for a specific employee
router.get('/employee/:employeeId', authMiddleware, async (req, res) => {
  const documents = await prisma.document.findMany({
    where: { employeeId: parseInt(req.params.employeeId) }
  });
  res.json(documents);
});

// Delete a document
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.document.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;