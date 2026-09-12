import api from './api';

export const getDocuments = () => api.get('/documents');

export const uploadDocument = (formData) =>
  api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });