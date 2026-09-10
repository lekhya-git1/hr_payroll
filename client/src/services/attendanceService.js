import axios from 'axios';

const API_URL = 'http://localhost:5000/api/attendance';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAttendance = () => axios.get(API_URL, authHeader());
export const markAttendance = (data) => axios.post(API_URL, data, authHeader());
export const updateAttendance = (id, data) => axios.put(`${API_URL}/${id}`, data, authHeader());