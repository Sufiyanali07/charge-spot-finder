import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:5000/api'
})

// Add request interceptor for authentication
api.interceptors.request.use(
  config => {
    // Get token from localStorage
    const token = localStorage.getItem('ev-charging-app') 
      ? JSON.parse(localStorage.getItem('ev-charging-app')).auth?.token 
      : null
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  error => Promise.reject(error)
)

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.removeItem('ev-charging-app')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api
