import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getAppointments: () => api.get('/user/appointments'),
  bookAppointment: (appointmentData) => api.post('/user/appointments', appointmentData),
  updateAppointment: (id, data) => api.put(`/user/appointments/${id}`, data),
};

export const therapistAPI = {
  getTherapists: () => api.get('/therapists'),
  getTherapist: (id) => api.get(`/therapists/${id}`),
  getAppointments: () => api.get('/therapist/appointments'),
  getAppointmentsByTherapist: (therapistId) => api.get(`/therapist/appointments/${therapistId}`),
  updateAppointment: (id, data) => api.put(`/therapist/appointments/${id}`, data),
  getAvailability: () => api.get('/therapist/availability'),
  getAvailabilityByTherapist: (therapistId) => api.get(`/therapist/availability/${therapistId}`),
  addAvailability: (data) => api.post('/therapist/availability', data),
  updateAvailability: (id, data) => api.put(`/therapist/availability/${id}`, data),
  deleteAvailability: (id) => api.delete(`/therapist/availability/${id}`),
  getPatients: (therapistId) => api.get(`/therapist/patients?therapistId=${therapistId}`),
  getProfile: () => api.get('/therapist/profile'),
  updateProfile: (data) => api.put('/therapist/profile', data),
};

export const chatAPI = {
  sendMessage: (message) => api.post('/chat/send', message),
  getChatHistory: () => api.get('/chat/history'),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getTherapists: () => api.get('/admin/therapists'),
  createTherapist: (therapistData) => api.post('/admin/therapists', therapistData),
  updateTherapist: (id, therapistData) => api.put(`/admin/therapists/${id}`, therapistData),
  deleteTherapist: (id) => api.delete(`/admin/therapists/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data) => api.put('/admin/profile', data),
};

export default api; 