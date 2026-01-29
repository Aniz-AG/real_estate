import axios from 'axios';


const token = localStorage.getItem('token');
console.log("token : ", token)

// Define base variables
const BASE_HOST = 'http://localhost:4000';
const API_VERSION = '/api/v1';

export const axiosInstance = axios.create({
  baseURL: `${BASE_HOST}${API_VERSION}`,
  withCredentials: true,
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});
