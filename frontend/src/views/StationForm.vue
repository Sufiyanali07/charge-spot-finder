<template>
  <div class="station-form">
    <h2>{{ isEditMode ? 'Edit' : 'Add' }} Charging Station</h2>
    
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div class="card mt-4">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- Basic Information -->
          <h4 class="mb-3">Basic Information</h4>
          <div class="row mb-4">
            <div class="col-md-6 mb-3">
              <label for="name" class="form-label">Station Name*</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="stationData.name"
                required
                placeholder="Enter station name"
              >
            </div>
            
            <div class="col-md-6 mb-3">
              <label for="status" class="form-label">Status*</label>
              <select
                id="status"
                class="form-select"
                v-model="stationData.status"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            
            <div class="col-md-12 mb-3">
              <label for="address" class="form-label">Address</label>
              <input
                type="text"
                class="form-control"
                id="address"
                v-model="stationData.address"
                placeholder="Enter full address"
              >
            </div>
          </div>
          
          <!-- Location Information -->
          <h4 class="mb-3">Location (Coordinates)*</h4>
          <div class="row mb-4">
            <div class="col-md-6 mb-3">
              <label for="latitude" class="form-label">Latitude*</label>
              <input
                type="number"
                class="form-control"
                id="latitude"
                v-model.number="stationData.location.latitude"
                required
                step="any"
                min="-90"
                max="90"
                placeholder="e.g. 40.7128"
              >
            </div>
            
            <div class="col-md-6 mb-3">
              <label for="longitude" class="form-label">Longitude*</label>
              <input
                type="number"
                class="form-control"
                id="longitude"
                v-model.number="stationData.location.longitude"
                required
                step="any"
                min="-180"
                max="180"
                placeholder="e.g. -74.0060"
              >
            </div>
            
            <div class="col-12">
              <div class="alert alert-info">
                <i class="bi bi-info-circle"></i> Tip: You can find coordinates by right-clicking on Google Maps and selecting "What's here?"
              </div>
            </div>
          </div>
          
          <!-- Technical Information -->
          <h4 class="mb-3">Technical Details</h4>
          <div class="row mb-4">
            <div class="col-md-6 mb-3">
              <label for="powerOutput" class="form-label">Power Output (kW)*</label>
              <input
                type="number"
                class="form-control"
                id="powerOutput"
                v-model.number="stationData.powerOutput"
                required
                min="0"
                step="0.1"
                placeholder="e.g. 50"
              >
            </div>
            
            <div class="col-md-6 mb-3">
              <label for="connectorType" class="form-label">Connector Type*</label>
              <select
                id="connectorType"
                class="form-select"
                v-model="stationData.connectorType"
                required
              >
                <option value="Type 1">Type 1</option>
                <option value="Type 2">Type 2</option>
                <option value="CCS">CCS</option>
                <option value="CHAdeMO">CHAdeMO</option>
                <option value="Tesla">Tesla</option>
              </select>
            </div>
            
            <div class="col-md-6 mb-3">
              <label for="pricePerKwh" class="form-label">Price per kWh ($)</label>
              <input
                type="number"
                class="form-control"
                id="pricePerKwh"
                v-model.number="stationData.pricePerKwh"
                min="0"
                step="0.01"
                placeholder="e.g. 0.25"
              >
            </div>
          </div>
          
          <!-- Operating Hours -->
          <h4 class="mb-3">Operating Hours</h4>
          <div class="row mb-4">
            <div class="col-md-6 mb-3">
              <label for="openTime" class="form-label">Opening Time</label>
              <input
                type="time"
                class="form-control"
                id="openTime"
                v-model="stationData.availableHours.open"
              >
            </div>
            
            <div class="col-md-6 mb-3">
              <label for="closeTime" class="form-label">Closing Time</label>
              <input
                type="time"
                class="form-control"
                id="closeTime"
                v-model="stationData.availableHours.close"
              >
            </div>
          </div>
          
          <!-- Submit Buttons -->
          <div class="d-flex justify-content-between">
            <router-link to="/stations" class="btn btn-secondary">
              Cancel
            </router-link>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ isEditMode ? 'Update' : 'Create' }} Station
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'StationForm',
  data() {
    return {
      stationData: {
        name: '',
        status: 'Active',
        address: '',
        location: {
          latitude: null,
          longitude: null
        },
        powerOutput: null,
        connectorType: 'Type 2',
        pricePerKwh: 0,
        availableHours: {
          open: '00:00',
          close: '23:59'
        }
      },
      isEditMode: false
    }
  },
  computed: {
    ...mapGetters(['loading', 'error', 'currentStation']),
    stationId() {
      return this.$route.params.id;
    }
  },
  methods: {
    ...mapActions(['createStation', 'updateStation', 'fetchStation', 'clearError']),
    
    async handleSubmit() {
      try {
        if (this.isEditMode) {
          await this.updateStation({
            stationId: this.stationId,
            stationData: this.stationData
          });
        } else {
          await this.createStation(this.stationData);
        }
      } catch (error) {
        console.error('Error saving station:', error);
      }
    },
    
    async loadStationData() {
      if (this.stationId) {
        this.isEditMode = true;
        
        try {
          await this.fetchStation(this.stationId);
          
          if (this.currentStation) {
            // Copy station data to form
            this.stationData = {
              name: this.currentStation.name,
              status: this.currentStation.status,
              address: this.currentStation.address || '',
              location: {
                latitude: this.currentStation.location.latitude,
                longitude: this.currentStation.location.longitude
              },
              powerOutput: this.currentStation.powerOutput,
              connectorType: this.currentStation.connectorType,
              pricePerKwh: this.currentStation.pricePerKwh || 0,
              availableHours: {
                open: this.currentStation.availableHours?.open || '00:00',
                close: this.currentStation.availableHours?.close || '23:59'
              }
            };
          }
        } catch (error) {
          console.error('Error loading station:', error);
          this.$router.push('/stations');
        }
      }
    }
  },
  created() {
    this.clearError();
    this.loadStationData();
  }
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css");

.station-form {
  padding-bottom: 2rem;
}

h4 {
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
}
</style>
