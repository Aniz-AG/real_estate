import axios from 'axios';


const token = localStorage.getItem('token');
console.log("token : ", token)

// Define base variables
const BASE_HOST = 'http://localhost:4000';
const API_VERSION = '/api/v1';

export const axiosInstance = axios.create({
  baseURL: `${BASE_HOST}${API_VERSION}`,
  withCredentials: true, // Enable cookies for all requests
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

// Add interceptor to include token in headers if needed (fallback for mobile)
axiosInstance.interceptors.request.use(
  (config) => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
