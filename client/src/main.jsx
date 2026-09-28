import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

axios.defaults.withCredentials = true;
// Production backend on Render, fallback to local during offline dev
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://fitnesssai.onrender.com';

// Add request interceptor to attach Bearer token if stored
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
