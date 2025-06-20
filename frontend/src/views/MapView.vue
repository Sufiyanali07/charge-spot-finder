<template>
  <div class="map-view">
    <h2 class="mb-3">Charging Stations Map</h2>
    
    <div class="row">
      <div class="col-md-8">
        <!-- Map Container -->
        <div class="card mb-4">
          <div class="card-body p-0">
            <div id="map" ref="mapContainer" class="map-container"></div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <!-- Station Details Panel -->
        <div class="card mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Station Details</h5>
          </div>
          <div class="card-body">
            <div v-if="selectedStation">
              <h4>{{ selectedStation.name }}</h4>
              <div class="mb-2">
                <span :class="getStatusBadgeClass(selectedStation.status)">
                  {{ selectedStation.status }}
                </span>
              </div>
              
              <div class="station-details">
                <p v-if="selectedStation.address" class="mb-2">
                  <i class="bi bi-geo-alt"></i> <strong>Address:</strong> {{ selectedStation.address }}
                </p>
                <p class="mb-2">
                  <i class="bi bi-lightning-charge"></i> <strong>Power Output:</strong> {{ selectedStation.powerOutput }} kW
                </p>
                <p class="mb-2">
                  <i class="bi bi-plug"></i> <strong>Connector Type:</strong> {{ selectedStation.connectorType }}
                </p>
                <p v-if="selectedStation.pricePerKwh" class="mb-2">
                  <i class="bi bi-currency-dollar"></i> <strong>Price:</strong> ${{ selectedStation.pricePerKwh }} per kWh
                </p>
                <p v-if="selectedStation.availableHours" class="mb-2">
                  <i class="bi bi-clock"></i> <strong>Hours:</strong> 
                  {{ selectedStation.availableHours.open }} - {{ selectedStation.availableHours.close }}
                </p>
                <p class="mb-2 text-muted">
                  <small>Added by: {{ selectedStation.owner?.username || 'Unknown' }}</small>
                </p>
              </div>
              
              <div class="mt-3" v-if="canManageStation(selectedStation)">
                <router-link 
                  :to="`/stations/${selectedStation._id}/edit`" 
                  class="btn btn-sm btn-outline-secondary me-2"
                >
                  <i class="bi bi-pencil"></i> Edit
                </router-link>
                <button 
                  class="btn btn-sm btn-outline-danger"
                  @click="confirmDelete(selectedStation)"
                >
                  <i class="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
            <div v-else class="text-center py-4">
              <i class="bi bi-map-fill text-muted" style="font-size: 3rem;"></i>
              <p class="mt-3 text-muted">Select a station on the map to view details</p>
            </div>
          </div>
        </div>
        
        <!-- Filter Panel -->
        <div class="card">
          <div class="card-header bg-light">
            <h5 class="mb-0">Filters</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="statusMapFilter" class="form-label">Status</label>
              <select
                id="statusMapFilter"
                class="form-select"
                v-model="mapFilters.status"
                @change="applyMapFilters"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            
            <div class="mb-3">
              <label for="connectorMapFilter" class="form-label">Connector Type</label>
              <select
                id="connectorMapFilter"
                class="form-select"
                v-model="mapFilters.connectorType"
                @change="applyMapFilters"
              >
                <option value="">All Connectors</option>
                <option value="Type 1">Type 1</option>
                <option value="Type 2">Type 2</option>
                <option value="CCS">CCS</option>
                <option value="CHAdeMO">CHAdeMO</option>
                <option value="Tesla">Tesla</option>
              </select>
            </div>
            
            <button class="btn btn-secondary w-100" @click="resetMapFilters">
              Reset Filters
            </button>
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
            <button type="button" class="btn btn-danger" @click="deleteSelectedStation">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default {
  name: 'MapView',
  data() {
    return {
      map: null,
      markerLayer: null,
      markers: {},
      selectedStation: null,
      showDeleteModal: false,
      stationToDelete: null,
      mapFilters: {
        status: '',
        connectorType: ''
      },
      isUnmounting: false,
      mapEventListeners: []
    }
  },
  computed: {
    ...mapGetters(['allStations', 'loading', 'isLoggedIn', 'user']),
    filteredMapStations() {
      let filtered = [...this.allStations];
      
      if (this.mapFilters.status) {
        filtered = filtered.filter(station => station.status === this.mapFilters.status);
      }
      
      if (this.mapFilters.connectorType) {
        filtered = filtered.filter(station => station.connectorType === this.mapFilters.connectorType);
      }
      
      return filtered;
    }
  },
  methods: {
    ...mapActions(['fetchStations', 'deleteStation']),
    
    // Helper method to validate coordinates
    isValidCoordinate(location) {
      if (!location || location.latitude === undefined || location.longitude === undefined) return false;
      
      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);
      
      return !isNaN(lat) && !isNaN(lng) && 
             lat >= -90 && lat <= 90 && 
             lng >= -180 && lng <= 180;
    },
    
    initializeMap() {
      try {
        // Check if map container exists
        if (!this.$refs.mapContainer) {
          console.error('Map container not found');
          return;
        }

        // Prevent re-initialization if map already exists
        if (this.map) {
          console.warn('Map already initialized');
          return;
        }

        // Add a flag to track unmounting state
        this.isUnmounting = false;

        // Initialize the map with Leaflet with zoomAnimation disabled
        this.map = L.map(this.$refs.mapContainer, {
          zoomAnimation: false, // Disable zoom animation to prevent the _latLngToNewLayerPoint error
          fadeAnimation: false  // Disable fade animation for better stability
        }).setView([39.8283, -98.5795], 4); // Center of USA
        
        // Add OpenStreetMap tile layer (free)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(this.map);
        
        // Create a layer group for markers
        this.markerLayer = L.layerGroup().addTo(this.map);
        
        // Add scale control
        L.control.scale().addTo(this.map);
        
        // Update markers when map is ready
        this.updateMapMarkers();
        
        // Check for station ID in query params
        const stationId = this.$route.query.id;
        if (stationId) {
          // Find the station in the current list
          const station = this.allStations.find(s => s._id === stationId);
          if (station) {
            this.selectedStation = station;
            
            // Center map on the station
            if (station.location && this.isValidCoordinate(station.location)) {
              const lat = parseFloat(station.location.latitude);
              const lng = parseFloat(station.location.longitude);
              this.map.setView([lat, lng], 15);
            }
          }
        }
        
        // Handle map click to deselect station - store reference to remove later
        const mapClickHandler = () => {
          // Skip if component is unmounting
          if (this.isUnmounting) return;
          
          // Check if any popups are open by looking at the map container
          if (this.$refs.mapContainer) {
            const popupElements = this.$refs.mapContainer.querySelectorAll('.leaflet-popup');
            if (popupElements.length === 0) {
              // No popups are open, so deselect the station
              this.selectedStation = null;
            }
          }
        };
        
        this.map.on('click', mapClickHandler);
        
        // Store event listeners for later cleanup
        this.mapEventListeners.push({
          event: 'click',
          handler: mapClickHandler
        });
        
        // Add error handling for map events
        this.map.on('error', (e) => {
          console.error('Leaflet map error:', e);
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    },
    
    // Create a custom icon for markers
    createMarkerIcon(color = '#3388ff') {
      return L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
    },
    
    updateMapMarkers() {
      // Skip if map is not initialized or component is unmounting
      if (!this.map || !this.markerLayer || this.isUnmounting) return;
      
      try {
        // Clear existing markers
        this.markerLayer.clearLayers();
        
        // Clean up marker references
        Object.keys(this.markers).forEach(key => {
          if (this.markers[key]) {
            this.markers[key].off();
          }
        });
        this.markers = {};
        
        // Add markers for filtered stations
        this.filteredMapStations.forEach(station => {
          if (!station.location || !this.isValidCoordinate(station.location)) return;
          
          // Parse coordinates to ensure they're valid numbers
          const lat = parseFloat(station.location.latitude);
          const lng = parseFloat(station.location.longitude);
          
          // Skip invalid coordinates
          if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.warn(`Invalid coordinates for station ${station.name}: ${lat}, ${lng}`);
            return;
          }
          
          // Create marker with appropriate icon based on status
          const color = this.getStatusColor(station.status);
          const marker = L.marker([lat, lng], {
            icon: this.createMarkerIcon(color)
          });
          
          // Create popup content
          const popupContent = `
            <strong>${station.name}</strong><br>
            <span class="badge ${this.getStatusBadgeClass(station.status)}">${station.status}</span><br>
            ${station.connectorType} - ${station.powerOutput} kW
          `;
          
          // Bind popup to marker
          marker.bindPopup(popupContent);
          
          // Add click handler
          const markerClickHandler = () => {
            if (!this.isUnmounting) {
              this.selectedStation = station;
            }
          };
          
          marker.on('click', markerClickHandler);
          
          // Add marker to layer and store reference
          marker.addTo(this.markerLayer);
          this.markers[station._id] = marker;
        });
      } catch (error) {
        console.error('Error updating map markers:', error);
      }
    },
    
    getStatusBadgeClass(status) {
      const classes = {
        'Active': 'badge bg-success',
        'Inactive': 'badge bg-secondary',
        'Maintenance': 'badge bg-warning text-dark'
      };
      return classes[status] || 'badge bg-secondary';
    },
    
    getStatusColor(status) {
      const colors = {
        'Active': '#28a745',     // Green
        'Inactive': '#6c757d',   // Gray
        'Maintenance': '#ffc107' // Yellow
      };
      return colors[status] || '#6c757d';
    },
    
    applyMapFilters() {
      this.updateMapMarkers();
    },
    
    resetMapFilters() {
      this.mapFilters = {
        status: '',
        connectorType: ''
      };
      this.updateMapMarkers();
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
    
    async deleteSelectedStation() {
      if (!this.stationToDelete) return;
      
      try {
        await this.deleteStation(this.stationToDelete._id);
        this.showDeleteModal = false;
        this.stationToDelete = null;
        this.selectedStation = null;
        
        // Update markers after deletion
        this.updateMapMarkers();
      } catch (error) {
        console.error('Error deleting station:', error);
      }
    }
  },
  mounted() {
    // Ensure the map container is properly rendered before initializing the map
    this.$nextTick(() => {
      this.fetchStations().then(() => {
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => {
          if (!this.isUnmounting) {
            this.initializeMap();
          }
        }, 100);
      });
    });
  },
  beforeUnmount() {
    // Set unmounting flag to prevent further interactions
    this.isUnmounting = true;
    
    // Clean up map instance and all event listeners
    if (this.map) {
      try {
        // Remove specific event listeners first
        this.mapEventListeners.forEach(listener => {
          this.map.off(listener.event, listener.handler);
        });
        
        // Then remove all other event listeners
        this.map.off();
        
        // Clear all markers and layers
        if (this.markerLayer) {
          this.markerLayer.clearLayers();
          this.markerLayer.remove();
          this.markerLayer = null;
        }
        
        // Clear all markers references
        Object.keys(this.markers).forEach(key => {
          if (this.markers[key]) {
            this.markers[key].off();
            if (this.map) this.markers[key].remove();
          }
        });
        this.markers = {};
        
        // Remove the map instance with a small delay to ensure all animations are complete
        setTimeout(() => {
          if (this.map) {
            this.map.remove();
            this.map = null;
          }
        }, 100);
      } catch (error) {
        console.error('Error cleaning up map:', error);
        // Ensure map is set to null even if there's an error
        this.map = null;
      }
    }
  },
  watch: {
    allStations() {
      if (this.map) {
        this.updateMapMarkers();
      }
    }
  }
}
</script>

<style scoped>
.map-container {
  height: 600px;
  width: 100%;
  border-radius: 0.25rem;
}

@media (max-width: 768px) {
  .map-container {
    height: 400px;
  }
}

/* Override Leaflet styles */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}

:deep(.leaflet-popup-content) {
  margin: 12px 16px;
  line-height: 1.5;
}
</style>
