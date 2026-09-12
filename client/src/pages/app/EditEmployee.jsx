import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployee, updateEmployee } from '../../services/employeeService'; // ✅ use service methods

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    getEmployee(id)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error('Failed to load employee:', err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee(id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        salary: formData.salary // ✅ include salary, vendorId removed
      });
      navigate('/employees');
    } catch (err) {
      console.error(err);
      alert('Failed to update employee');
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Employee</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
        <input name="firstName" value={formData.firstName} onChange={handleChange} required />
        <input name="lastName" value={formData.lastName} onChange={handleChange} required />
        <input name="email" value={formData.email} onChange={handleChange} required />
        <input name="role" value={formData.role} onChange={handleChange} required />
        <input name="department" value={formData.department} onChange={handleChange} required />
        <input name="salary" value={formData.salary} onChange={handleChange} required /> {/* ✅ new salary field */}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditEmployee;
