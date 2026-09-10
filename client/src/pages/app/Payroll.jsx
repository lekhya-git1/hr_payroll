import { useEffect, useState } from 'react';
import { getPayrolls, generatePayroll, markAsPaid } from '../../services/payrollService';

function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    month: '',
    totalWorkingDays: ''
  });

  const loadPayrolls = () => {
    getPayrolls()
      .then((res) => setPayrolls(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadPayrolls();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      await generatePayroll({
        employeeId: parseInt(formData.employeeId),
        month: formData.month,
        totalWorkingDays: parseInt(formData.totalWorkingDays)
      });
      setFormData({ employeeId: '', month: '', totalWorkingDays: '' });
      loadPayrolls();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate payroll');
    }
  };

  const handleMarkPaid = async (id) => {
    await markAsPaid(id);
    loadPayrolls();
  };

  return (
    <div>
      <h1>Payroll</h1>

      <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          name="employeeId"
          placeholder="Employee ID"
          value={formData.employeeId}
          onChange={handleChange}
          required
        />
        <input
          name="month"
          placeholder="YYYY-MM (e.g. 2026-09)"
          value={formData.month}
          onChange={handleChange}
          required
        />
        <input
          name="totalWorkingDays"
          placeholder="Working Days"
          value={formData.totalWorkingDays}
          onChange={handleChange}
          required
        />
        <button type="submit">Generate Payroll</button>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Month</th>
            <th>Days Present</th>
            <th>Gross Pay</th>
            <th>Tax</th>
            <th>PF</th>
            <th>Net Pay</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((p) => (
            <tr key={p.id}>
              <td>{p.employee?.firstName} {p.employee?.lastName}</td>
              <td>{p.month}</td>
              <td>{p.daysPresent} / {p.totalWorkingDays}</td>
              <td>{p.grossPay.toFixed(2)}</td>
              <td>{p.taxDeduction.toFixed(2)}</td>
              <td>{p.pfDeduction.toFixed(2)}</td>
              <td>{p.netPay.toFixed(2)}</td>
              <td>{p.status}</td>
              <td>
                {p.status === 'pending' && (
                  <button onClick={() => handleMarkPaid(p.id)}>Mark Paid</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Payroll;