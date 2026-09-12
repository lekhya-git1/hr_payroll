import api from './api';

export const getVendors = () => api.get('/vendors');
export const createVendor = (data) => api.post('/vendors', data);
