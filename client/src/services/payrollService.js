import api from './api';

export const getPayrolls = () => api.get('/payroll');
export const generatePayroll = (data) => api.post('/payroll/generate', data);
export const markAsPaid = (id) => api.put(`/payroll/${id}/pay`, {});
