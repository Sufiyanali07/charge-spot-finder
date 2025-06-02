<template>
  <div class="profile-page">
    <h2 class="mb-4">User Profile</h2>
    
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading profile...</p>
    </div>
    
    <div v-else-if="user" class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Account Information</h4>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" :value="user.username" disabled>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" :value="user.email" disabled>
            </div>
            <div class="mb-3">
              <label class="form-label">Role</label>
              <input type="text" class="form-control" :value="user.role" disabled>
            </div>
            <div class="mb-3">
              <label class="form-label">Member Since</label>
              <input type="text" class="form-control" :value="formatDate(user.createdAt)" disabled>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Your Stations</h4>
          </div>
          <div class="card-body">
            <div v-if="userStations.length === 0" class="text-center py-4">
              <p>You haven't added any charging stations yet.</p>
              <router-link to="/stations/new" class="btn btn-primary">
                Add Your First Station
              </router-link>
            </div>
            <div v-else>
              <div class="list-group">
                <router-link 
                  v-for="station in userStations" 
                  :key="station._id"
                  :to="`/stations/${station._id}/edit`"
                  class="list-group-item list-group-item-action"
                >
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{ station.name }}</h5>
                    <span :class="getStatusBadgeClass(station.status)">
                      {{ station.status }}
                    </span>
                  </div>
                  <p class="mb-1">{{ station.connectorType }} - {{ station.powerOutput }} kW</p>
                  <small>Added: {{ formatDate(station.createdAt) }}</small>
                </router-link>
              </div>
              <div class="mt-3 text-end">
                <router-link to="/stations/new" class="btn btn-primary">
                  Add New Station
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Profile',
  computed: {
    ...mapGetters(['user', 'loading', 'allStations']),
    userStations() {
      if (!this.user || !this.allStations) return [];
      return this.allStations.filter(station => station.owner?._id === this.user._id);
    }
  },
  methods: {
    ...mapActions(['fetchUserProfile', 'fetchStations']),
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getStatusBadgeClass(status) {
      const classes = {
        'Active': 'badge bg-success',
        'Inactive': 'badge bg-secondary',
        'Maintenance': 'badge bg-warning text-dark'
      };
      return classes[status] || 'badge bg-secondary';
    }
  },
  created() {
    this.fetchUserProfile();
    this.fetchStations();
  }
}
</script>

<style scoped>
.profile-page {
  padding-bottom: 2rem;
}

.card {
  margin-bottom: 1.5rem;
}
</style>
