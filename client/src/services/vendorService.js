import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vendors';

export const getVendors = () => axios.get(API_URL);
export const createVendor = (data) => axios.post(API_URL, data);