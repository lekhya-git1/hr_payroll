import api from './api';

export const getLeaves = () => api.get('/leave');
export const requestLeave = (data) => api.post('/leave', data);
export const updateLeaveStatus = (id, status) =>
  api.put(`/leave/${id}/status`, { status });
