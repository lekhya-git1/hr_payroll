import { useEffect, useState } from 'react';
import { getLeaves, requestLeave, updateLeaveStatus } from '../../services/leaveService';

function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    reason: '',
    type: 'casual'
  });

  const loadLeaves = () => {
    getLeaves()
      .then((res) => setLeaves(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestLeave({
        ...formData,
        employeeId: parseInt(formData.employeeId)
      });
      setFormData({ employeeId: '', startDate: '', endDate: '', reason: '', type: 'casual' });
      loadLeaves();
    } catch (err) {
      alert('Failed to submit leave request');
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateLeaveStatus(id, status);
    loadLeaves();
  };

  return (
    <div>
      <h1>Leave</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          name="employeeId"
          placeholder="Employee ID"
          value={formData.employeeId}
          onChange={handleChange}
          required
        />
        <input
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        <input
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="casual">Casual</option>
          <option value="sick">Sick</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <input
          name="reason"
          placeholder="Reason"
          value={formData.reason}
          onChange={handleChange}
        />
        <button type="submit">Request Leave</button>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Start</th>
            <th>End</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l.id}>
              <td>{l.employee?.firstName} {l.employee?.lastName}</td>
              <td>{new Date(l.startDate).toLocaleDateString()}</td>
              <td>{new Date(l.endDate).toLocaleDateString()}</td>
              <td>{l.type}</td>
              <td>{l.reason}</td>
              <td>{l.status}</td>
              <td>
                {l.status === 'pending' && (
                  <>
                    <button onClick={() => handleStatusChange(l.id, 'approved')}>Approve</button>{' '}
                    <button onClick={() => handleStatusChange(l.id, 'rejected')}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leave;