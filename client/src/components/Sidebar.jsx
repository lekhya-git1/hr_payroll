import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div style={{ width: '220px', background: '#1e293b', color: 'white', height: '100vh', padding: '16px' }}>
      <h2 style={{ marginBottom: '24px' }}>HR Payroll</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
        <Link to="/employees" style={{ color: 'white' }}>Employees</Link>
        <Link to="/vendors" style={{ color: 'white' }}>Vendors</Link>
        <Link to="/payroll" style={{ color: 'white' }}>Payroll</Link>
      </nav>
    </div>
  );
}

export default Sidebar;