import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001/api' });

// Add the Authorization header to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getSchedules = () => API.get('/schedules');
export const createSchedule = (data) => API.post('/schedules', data);
export const updateSchedule = (id, data) => API.put(`/schedules/${id}`, data);
export const deleteSchedule = (id) => API.delete(`/schedules/${id}`);
