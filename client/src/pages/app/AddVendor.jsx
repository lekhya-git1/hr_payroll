import { useState } from 'react';
import { createVendor } from '../../services/vendorService';
import { useNavigate } from 'react-router-dom';

function AddVendor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVendor(formData);
      navigate('/vendors');
    } catch (err) {
      console.error(err);
      alert('Failed to add vendor');
    }
  };

  return (
    <div>
      <h1>Add Vendor</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
        <input name="name" placeholder="Vendor Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <button type="submit">Add Vendor</button>
      </form>
    </div>
  );
}

export default AddVendor;