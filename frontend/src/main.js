import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// Import Bootstrap JavaScript
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Define feature flags to avoid warnings
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false

// Initialize auth token from store if available
const token = store.getters.token
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Create and mount the Vue application
const app = createApp(App)
app.use(store)
app.use(router)

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  app.mount('#app')
})
