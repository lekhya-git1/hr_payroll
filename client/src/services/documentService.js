import axios from 'axios';

const API_URL = 'http://localhost:5000/api/documents';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getDocuments = () => axios.get(API_URL, authHeader());

export const uploadDocument = (formData) =>
  axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data'
    }
  });