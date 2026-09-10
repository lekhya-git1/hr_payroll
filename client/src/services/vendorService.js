import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vendors';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getVendors = () => axios.get(API_URL, authHeader());
export const createVendor = (data) => axios.post(API_URL, data, authHeader());