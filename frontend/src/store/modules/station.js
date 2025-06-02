import axios from 'axios'
import router from '../../router'

const state = {
  stations: [],
  station: null,
  filters: {
    status: '',
    connectorType: '',
    minPower: '',
    maxPower: ''
  }
}

const getters = {
  allStations: state => state.stations,
  filteredStations: state => {
    let filtered = [...state.stations]
    
    // Apply filters
    if (state.filters.status) {
      filtered = filtered.filter(station => station.status === state.filters.status)
    }
    
    if (state.filters.connectorType) {
      filtered = filtered.filter(station => station.connectorType === state.filters.connectorType)
    }
    
    if (state.filters.minPower) {
      filtered = filtered.filter(station => station.powerOutput >= Number(state.filters.minPower))
    }
    
    if (state.filters.maxPower) {
      filtered = filtered.filter(station => station.powerOutput <= Number(state.filters.maxPower))
    }
    
    return filtered
  },
  currentStation: state => state.station,
  filters: state => state.filters
}

const mutations = {
  SET_STATIONS(state, stations) {
    state.stations = stations
  },
  SET_STATION(state, station) {
    state.station = station
  },
  ADD_STATION(state, station) {
    state.stations.push(station)
  },
  UPDATE_STATION(state, updatedStation) {
    const index = state.stations.findIndex(s => s._id === updatedStation._id)
    if (index !== -1) {
      state.stations.splice(index, 1, updatedStation)
    }
    if (state.station && state.station._id === updatedStation._id) {
      state.station = updatedStation
    }
  },
  REMOVE_STATION(state, stationId) {
    state.stations = state.stations.filter(s => s._id !== stationId)
    if (state.station && state.station._id === stationId) {
      state.station = null
    }
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  RESET_FILTERS(state) {
    state.filters = {
      status: '',
      connectorType: '',
      minPower: '',
      maxPower: ''
    }
  }
}

const actions = {
  // Fetch all stations
  async fetchStations({ commit, dispatch, state }) {
    try {
      dispatch('setLoading', true, { root: true })
      
      // Build query string from filters
      const params = new URLSearchParams()
      if (state.filters.status) params.append('status', state.filters.status)
      if (state.filters.connectorType) params.append('connectorType', state.filters.connectorType)
      if (state.filters.minPower) params.append('minPower', state.filters.minPower)
      if (state.filters.maxPower) params.append('maxPower', state.filters.maxPower)
      
      const queryString = params.toString() ? `?${params.toString()}` : ''
      const response = await axios.get(`/api/stations${queryString}`)
      
      commit('SET_STATIONS', response.data)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch stations'
      dispatch('setError', message, { root: true })
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Fetch a single station by ID
  async fetchStation({ commit, dispatch }, stationId) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await axios.get(`/api/stations/${stationId}`)
      commit('SET_STATION', response.data)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch station details'
      dispatch('setError', message, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Create a new station
  async createStation({ commit, dispatch }, stationData) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await axios.post('/api/stations', stationData)
      commit('ADD_STATION', response.data)
      dispatch('setSuccess', 'Charging station created successfully!', { root: true })
      router.push('/stations')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create station'
      dispatch('setError', message, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Update an existing station
  async updateStation({ commit, dispatch }, { stationId, stationData }) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await axios.put(`/api/stations/${stationId}`, stationData)
      commit('UPDATE_STATION', response.data)
      dispatch('setSuccess', 'Charging station updated successfully!', { root: true })
      router.push('/stations')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update station'
      dispatch('setError', message, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Delete a station
  async deleteStation({ commit, dispatch }, stationId) {
    try {
      dispatch('setLoading', true, { root: true })
      await axios.delete(`/api/stations/${stationId}`)
      commit('REMOVE_STATION', stationId)
      dispatch('setSuccess', 'Charging station deleted successfully!', { root: true })
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete station'
      dispatch('setError', message, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // Set filters
  setFilters({ commit, dispatch }, filters) {
    commit('SET_FILTERS', filters)
    dispatch('fetchStations')
  },
  
  // Reset filters
  resetFilters({ commit, dispatch }) {
    commit('RESET_FILTERS')
    dispatch('fetchStations')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
