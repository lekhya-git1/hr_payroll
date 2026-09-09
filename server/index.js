const payrollRouter = require('./routes/payroll.routes');
const leaveRouter = require('./routes/leave.routes');
const attendanceRouter = require('./routes/attendance.routes');
const authRouter = require('./routes/auth.routes');
const employeesRouter = require('./routes/employees.routes'); 
const vendorsRouter = require('./routes/vendors.routes');
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/payroll', payrollRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/employees', employeesRouter);
// app.use('/api/vendors', vendorsRouter); 
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('HR Payroll API is running');
});

const PORT = process.env.PORT || 5000;
app.use('/api/vendors', vendorsRouter);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});