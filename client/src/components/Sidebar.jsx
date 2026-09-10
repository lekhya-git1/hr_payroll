import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ width: '220px', background: '#1e293b', color: 'white', height: '100vh', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ marginBottom: '24px' }}>HR Payroll</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
          <Link to="/employees" style={{ color: 'white' }}>Employees</Link>
          <Link to="/vendors" style={{ color: 'white' }}>Vendors</Link>
          <Link to="/payroll" style={{ color: 'white' }}>Payroll</Link>
          <Link to="/attendance" style={{ color: 'white' }}>Attendance</Link>
          <Link to="/leave" style={{ color: 'white' }}>Leave</Link>
          <Link to="/expenses" style={{ color: 'white' }}>Expenses</Link>
          <Link to="/documents" style={{ color: 'white' }}>Documents</Link>
          <Link to="/reports" style={{ color: 'white' }}>Reports</Link>
        </nav>
      </div>
      <button onClick={handleLogout} style={{ padding: '8px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;