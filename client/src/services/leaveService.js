import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leave';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getLeaves = () => axios.get(API_URL, authHeader());
export const requestLeave = (data) => axios.post(API_URL, data, authHeader());
export const updateLeaveStatus = (id, status) =>
  axios.put(`${API_URL}/${id}/status`, { status }, authHeader());