import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../../services/employeeService';

function Employees() {
  const [employees, setEmployees] = useState([]);

  const loadEmployees = () => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      await deleteEmployee(id);
      loadEmployees();
    }
  };

  return (
    <div>
      <h1>Employees</h1>
      <Link to="/employees/add">+ Add Employee</Link>
      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>
            {emp.firstName} {emp.lastName} — {emp.role} ({emp.department}){' '}
            <Link to={`/employees/edit/${emp.id}`}>Edit</Link>{' '}
            <button onClick={() => handleDelete(emp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Employees;