import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getEmployees = () => axios.get(API_URL, authHeader());
export const createEmployee = (data) => axios.post(API_URL, data, authHeader());
export const updateEmployee = (id, data) => axios.put(`${API_URL}/${id}`, data, authHeader());
export const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`, authHeader());