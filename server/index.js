const employeesRouter = require('./routes/employees.routes'); 
const vendorsRouter = require('./routes/vendors.routes');
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/employees', employeesRouter);
// app.use('/api/vendors', vendorsRouter); 

app.get('/', (req, res) => {
  res.send('HR Payroll API is running');
});

const PORT = process.env.PORT || 5000;
app.use('/api/vendors', vendorsRouter);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});