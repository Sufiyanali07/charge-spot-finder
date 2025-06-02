import axios from 'axios'
import router from '../../router'

const state = {
  token: null,
  user: null
}

const getters = {
  isLoggedIn: state => !!state.token,
  token: state => state.token,
  user: state => state.user
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USER(state, user) {
    state.user = user
  },
  CLEAR_AUTH(state) {
    state.token = null
    state.user = null
  }
}

const actions = {
  // Register a new user
  async register({ commit, dispatch }, userData) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await axios.post('/api/auth/register', userData)
      const { token, ...user } = response.data
      
      // Save token and user data
      commit('SET_TOKEN', token)
      commit('SET_USER', user)
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      dispatch('setSuccess', 'Registration successful!', { root: true })
      router.push('/')
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch('setError', message, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Login user
  async login({ commit, dispatch }, credentials) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await axios.post('/api/auth/login', credentials)
      const { token, ...user } = response.data
      
      // Save token and user data
      commit('SET_TOKEN', token)
      commit('SET_USER', user)
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      dispatch('setSuccess', 'Login successful!', { root: true })
      
      // Redirect to intended destination or home
      const redirectPath = router.currentRoute.value.query.redirect || '/'
      router.push(redirectPath)
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch('setError', message, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Logout user
  logout({ commit, dispatch }) {
    // Clear auth data
    commit('CLEAR_AUTH')
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization']
    
    dispatch('setSuccess', 'Logged out successfully', { root: true })
    router.push('/login')
  },
  
  // Initialize auth from stored token
  initAuth({ commit, dispatch, state }) {
    const token = state.token
    
    if (token) {
      // Set auth header for requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Ensure the token is set for all future axios requests
      axios.interceptors.request.use(config => {
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      })
      
      // Get user profile if we have token but no user data
      if (!state.user) {
        dispatch('fetchUserProfile')
      }
    }
  },
  
  // Fetch user profile
  async fetchUserProfile({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await axios.get('/api/auth/profile')
      commit('SET_USER', response.data)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      // If unauthorized, logout
      if (error.response?.status === 401) {
        dispatch('logout')
      }
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
