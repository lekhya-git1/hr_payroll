import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reports';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getSummary = () => axios.get(`${API_URL}/summary`, authHeader());
export const getAttendanceReport = () => axios.get(`${API_URL}/attendance`, authHeader());
export const getPayrollReport = () => axios.get(`${API_URL}/payroll`, authHeader());
export const getVendorReport = () => axios.get(`${API_URL}/vendors`, authHeader());