import { useEffect, useState } from 'react';
import { getAttendance, markAttendance } from '../../services/attendanceService';

function Attendance() {
  const [records, setRecords] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('present');

  const loadRecords = () => {
    getAttendance()
      .then((res) => setRecords(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await markAttendance({ employeeId: parseInt(employeeId), status });
      setEmployeeId('');
      loadRecords();
    } catch (err) {
      alert('Failed to mark attendance');
    }
  };

  return (
    <div>
      <h1>Attendance</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="half-day">Half Day</option>
          <option value="leave">Leave</option>
        </select>
        <button type="submit">Mark Attendance</button>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Status</th>
            <th>Check In</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.employee?.firstName} {r.employee?.lastName}</td>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td>{r.status}</td>
              <td>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Attendance;