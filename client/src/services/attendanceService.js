import api from './api';

export const getAttendance = () => api.get('/attendance');
export const markAttendance = (data) => api.post('/attendance', data);
export const updateAttendance = (id, data) => api.put(`/attendance/${id}`, data);
