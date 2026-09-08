import { useState } from 'react';
import { createEmployee } from '../../services/employeeService';
import { useNavigate } from 'react-router-dom';

function AddEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    vendorId: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEmployee({
        ...formData,
        vendorId: parseInt(formData.vendorId)
      });
      navigate('/employees');
    } catch (err) {
      console.error(err);
      alert('Failed to add employee');
    }
  };

  return (
    <div>
      <h1>Add Employee</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="role" placeholder="Role" onChange={handleChange} required />
        <input name="department" placeholder="Department" onChange={handleChange} required />
        <input name="vendorId" placeholder="Vendor ID" onChange={handleChange} required />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;