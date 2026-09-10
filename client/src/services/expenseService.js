import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getExpenses = () => axios.get(API_URL, authHeader());
export const submitExpense = (data) => axios.post(API_URL, data, authHeader());
export const updateExpenseStatus = (id, status) =>
  axios.put(`${API_URL}/${id}/status`, { status }, authHeader());