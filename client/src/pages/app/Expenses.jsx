import { useEffect, useState } from 'react';
import { getExpenses, submitExpense, updateExpenseStatus } from '../../services/expenseService';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    title: '',
    amount: '',
    category: 'general',
    description: ''
  });

  const loadExpenses = () => {
    getExpenses()
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitExpense({
        ...formData,
        employeeId: parseInt(formData.employeeId),
        amount: parseFloat(formData.amount)
      });
      setFormData({ employeeId: '', title: '', amount: '', category: 'general', description: '' });
      loadExpenses();
    } catch (err) {
      alert('Failed to submit expense');
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateExpenseStatus(id, status);
    loadExpenses();
  };

  return (
    <div>
      <h1>Expenses</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          name="employeeId"
          placeholder="Employee ID"
          value={formData.employeeId}
          onChange={handleChange}
          required
        />
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="general">General</option>
          <option value="travel">Travel</option>
          <option value="food">Food</option>
          <option value="supplies">Supplies</option>
        </select>
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">Submit Expense</button>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>{e.employee?.firstName} {e.employee?.lastName}</td>
              <td>{e.title}</td>
              <td>{e.amount.toFixed(2)}</td>
              <td>{e.category}</td>
              <td>{e.status}</td>
              <td>
                {e.status === 'pending' && (
                  <>
                    <button onClick={() => handleStatusChange(e.id, 'approved')}>Approve</button>{' '}
                    <button onClick={() => handleStatusChange(e.id, 'rejected')}>Reject</button>
                  </>
                )}
                {e.status === 'approved' && (
                  <button onClick={() => handleStatusChange(e.id, 'reimbursed')}>Mark Reimbursed</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Expenses;