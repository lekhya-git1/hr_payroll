import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payroll';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getPayrolls = () => axios.get(API_URL, authHeader());
export const generatePayroll = (data) => axios.post(`${API_URL}/generate`, data, authHeader());
export const markAsPaid = (id) => axios.put(`${API_URL}/${id}/pay`, {}, authHeader());
