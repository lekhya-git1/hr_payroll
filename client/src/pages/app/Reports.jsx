import { useEffect, useState } from 'react';
import {
  getSummary,
  getAttendanceReport,
  getPayrollReport,
  getVendorReport
} from '../../services/reportService';

function Reports() {
  const [summary, setSummary] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    getSummary().then((res) => setSummary(res.data)).catch((err) => console.error(err));
    getAttendanceReport().then((res) => setAttendance(res.data)).catch((err) => console.error(err));
    getPayrollReport().then((res) => setPayroll(res.data)).catch((err) => console.error(err));
    getVendorReport().then((res) => setVendors(res.data)).catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Reports</h1>

      {summary && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '6px' }}>
            <p>Total Employees</p>
            <h2>{summary.totalEmployees}</h2>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '6px' }}>
            <p>Total Vendors</p>
            <h2>{summary.totalVendors}</h2>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '6px' }}>
            <p>Pending Leaves</p>
            <h2>{summary.pendingLeaves}</h2>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '6px' }}>
            <p>Pending Expenses</p>
            <h2>{summary.pendingExpenses}</h2>
          </div>
          <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '6px' }}>
            <p>Total Payroll Paid</p>
            <h2>{summary.totalPayrollPaid.toFixed(2)}</h2>
          </div>
        </div>
      )}

      <h2>Attendance by Employee</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a) => (
            <tr key={a.employeeId}>
              <td>{a.name}</td>
              <td>{a.totalPresent}</td>
              <td>{a.totalAbsent}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Payroll History</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Month</th>
            <th>Net Pay</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payroll.map((p) => (
            <tr key={p.id}>
              <td>{p.employee?.firstName} {p.employee?.lastName}</td>
              <td>{p.month}</td>
              <td>{p.netPay.toFixed(2)}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Vendors Overview</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Employee Count</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((v) => (
            <tr key={v.vendorId}>
              <td>{v.name}</td>
              <td>{v.employeeCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;