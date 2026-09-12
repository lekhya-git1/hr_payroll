import api from './api';

export const getExpenses = () => api.get('/expenses');
export const submitExpense = (data) => api.post('/expenses', data);
export const updateExpenseStatus = (id, status) =>
  api.put(`/expenses/${id}/status`, { status });
