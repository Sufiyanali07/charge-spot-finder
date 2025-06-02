import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import authModule from './modules/auth'
import stationModule from './modules/station'

// Create a Vuex persistence instance to save state to localStorage
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'ev-charging-app',
  modules: ['auth'] // Only persist auth module
})

// Create the Vuex store
export default createStore({
  state: {
    loading: false,
    error: null,
    success: null
  },
  getters: {
    loading: state => state.loading,
    error: state => state.error,
    success: state => state.success
  },
  mutations: {
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    SET_SUCCESS(state, message) {
      state.success = message
    },
    CLEAR_SUCCESS(state) {
      state.success = null
    }
  },
  actions: {
    setLoading({ commit }, status) {
      commit('SET_LOADING', status)
    },
    setError({ commit }, error) {
      commit('SET_ERROR', error)
      // Auto clear error after 5 seconds
      setTimeout(() => {
        commit('CLEAR_ERROR')
      }, 5000)
    },
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    },
    setSuccess({ commit }, message) {
      commit('SET_SUCCESS', message)
      // Auto clear success message after 5 seconds
      setTimeout(() => {
        commit('CLEAR_SUCCESS')
      }, 5000)
    },
    clearSuccess({ commit }) {
      commit('CLEAR_SUCCESS')
    }
  },
  modules: {
    auth: authModule,
    station: stationModule
  },
  plugins: [vuexLocal.plugin]
})
