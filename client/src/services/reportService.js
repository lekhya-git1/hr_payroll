import api from './api';

export const getSummary = () => api.get('/reports/summary');
export const getAttendanceReport = () => api.get('/reports/attendance');
export const getPayrollReport = () => api.get('/reports/payroll');
export const getVendorReport = () => api.get('/reports/vendors');
