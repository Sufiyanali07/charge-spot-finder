<template>
  <div class="station-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Charging Stations</h2>
      <router-link v-if="isLoggedIn" to="/stations/new" class="btn btn-primary" id="addStationBtn">
        <i class="bi bi-plus-circle"></i> Add New Station
      </router-link>
      <button v-else @click="redirectToLogin" class="btn btn-outline-primary">
        <i class="bi bi-box-arrow-in-right"></i> Login to Add Station
      </button>
    </div>

    <!-- Filter Section -->
    <div class="card mb-4">
      <div class="card-header bg-light">
        <h5 class="mb-0">Filters</h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-3 mb-3">
            <label for="statusFilter" class="form-label">Status</label>
            <select 
              id="statusFilter" 
              class="form-select" 
              v-model="filters.status"
              @change="applyFilters"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          
          <div class="col-md-3 mb-3">
            <label for="connectorFilter" class="form-label">Connector Type</label>
            <select 
              id="connectorFilter" 
              class="form-select" 
              v-model="filters.connectorType"
              @change="applyFilters"
            >
              <option value="">All Connectors</option>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="Tesla">Tesla</option>
            </select>
          </div>
          
          <div class="col-md-3 mb-3">
            <label for="minPowerFilter" class="form-label">Min Power (kW)</label>
            <input 
              type="number" 
              id="minPowerFilter" 
              class="form-control" 
              v-model="filters.minPower"
              min="0"
              @change="applyFilters"
            >
          </div>
          
          <div class="col-md-3 mb-3">
            <label for="maxPowerFilter" class="form-label">Max Power (kW)</label>
            <input 
              type="number" 
              id="maxPowerFilter" 
              class="form-control" 
              v-model="filters.maxPower"
              min="0"
              @change="applyFilters"
            >
          </div>
        </div>
        
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary" @click="resetFilters">
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading stations...</p>
    </div>

    <!-- No Stations Message -->
    <div v-else-if="filteredStations.length === 0" class="alert alert-info">
      No charging stations found. Please try different filters or add a new station.
    </div>

    <!-- Stations List -->
    <div v-else class="row">
      <div v-for="station in filteredStations" :key="station._id" class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ station.name }}</h5>
            <span :class="getStatusBadgeClass(station.status)">
              {{ station.status }}
            </span>
          </div>
          <div class="card-body">
            <p v-if="station.address" class="mb-2">
              <i class="bi bi-geo-alt"></i> {{ station.address }}
            </p>
            <p class="mb-2">
              <i class="bi bi-lightning-charge"></i> {{ station.powerOutput }} kW
            </p>
            <p class="mb-2">
              <i class="bi bi-plug"></i> {{ station.connectorType }}
            </p>
            <p v-if="station.pricePerKwh" class="mb-2">
              <i class="bi bi-currency-dollar"></i> {{ station.pricePerKwh }} per kWh
            </p>
            <p class="mb-0 text-muted">
              <small>Added by: {{ station.owner?.username || 'Unknown' }}</small>
            </p>
          </div>
          <div class="card-footer bg-white border-top-0">
            <div class="d-flex justify-content-between">
              <button 
                class="btn btn-sm btn-outline-primary"
                @click="viewOnMap(station)"
              >
                <i class="bi bi-map"></i> View on Map
              </button>
              
              <div v-if="canManageStation(station)">
                <router-link 
                  :to="`/stations/${station._id}/edit`" 
                  class="btn btn-sm btn-outline-secondary me-1"
                >
                  <i class="bi bi-pencil"></i> Edit
                </router-link>
                <button 
                  class="btn btn-sm btn-outline-danger"
                  @click="confirmDelete(station)"
                >
                  <i class="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete the charging station "{{ stationToDelete?.name }}"?</p>
            <p class="text-danger">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="handleStationDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'StationList',
  data() {
    return {
      filters: {
        status: '',
        connectorType: '',
        minPower: '',
        maxPower: ''
      },
      showDeleteModal: false,
      stationToDelete: null
    }
  },
  computed: {
    ...mapGetters(['loading', 'filteredStations', 'isLoggedIn', 'user']),
  },
  methods: {
    ...mapActions(['fetchStations', 'setFilters', 'resetFilters', 'deleteStation']),
    
    applyFilters() {
      this.setFilters(this.filters);
    },
    
    getStatusBadgeClass(status) {
      const classes = {
        'Active': 'badge bg-success',
        'Inactive': 'badge bg-secondary',
        'Maintenance': 'badge bg-warning text-dark'
      };
      return classes[status] || 'badge bg-secondary';
    },
    
    viewOnMap(station) {
      this.$router.push({ 
        name: 'MapView', 
        query: { 
          lat: station.location.latitude, 
          lng: station.location.longitude,
          id: station._id
        } 
      });
    },
    
    canManageStation(station) {
      if (!this.isLoggedIn || !this.user) return false;
      
      // User can manage if they are the owner or an admin
      return (station.owner?._id === this.user._id) || (this.user.role === 'admin');
    },
    
    confirmDelete(station) {
      this.stationToDelete = station;
      this.showDeleteModal = true;
    },
    
    redirectToLogin() {
      this.$router.push({ 
        name: 'Login', 
        query: { redirect: '/stations/new' }
      });
    },
    
    async handleStationDelete() {
      if (!this.stationToDelete) return;
      
      try {
        await this.deleteStation(this.stationToDelete._id);
        this.showDeleteModal = false;
        this.stationToDelete = null;
      } catch (error) {
        console.error('Error deleting station:', error);
      }
    }
  },
  created() {
    // Initialize filters from Vuex store
    this.filters = { ...this.$store.getters.filters };
    
    // Fetch stations on component creation
    this.fetchStations();
  }
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css");

.station-list {
  padding-bottom: 2rem;
}

.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

/* Modal backdrop */
.modal {
  backdrop-filter: blur(5px);
}
</style>
