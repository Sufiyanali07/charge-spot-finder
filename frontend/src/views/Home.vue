<template>
  <div class="home">
    <div class="jumbotron bg-light p-5 rounded-3 mb-4">
      <h1 class="display-4">EV Charging Station Management</h1>
      <p class="lead">
        Find and manage electric vehicle charging stations with our comprehensive platform.
      </p>
      <hr class="my-4">
      <p>
        Browse our network of charging stations, filter by connector type, power output, and status.
        Registered users can add new stations and manage existing ones.
      </p>
      <div class="d-flex gap-2">
        <router-link to="/stations" class="btn btn-primary btn-lg">
          View Stations
        </router-link>
        <router-link to="/map" class="btn btn-success btn-lg">
          Map View
        </router-link>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Find Stations</h5>
            <p class="card-text">
              Browse our comprehensive database of EV charging stations. Filter by location, connector type, and more.
            </p>
            <router-link to="/stations" class="btn btn-outline-primary">
              Browse Stations
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Map View</h5>
            <p class="card-text">
              Visualize all charging stations on an interactive map. Find the nearest station to your location.
            </p>
            <router-link to="/map" class="btn btn-outline-success">
              Open Map
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Manage Stations</h5>
            <p class="card-text">
              Register to add your own charging stations to our network or manage existing ones.
            </p>
            <router-link v-if="!isLoggedIn" to="/register" class="btn btn-outline-secondary">
              Register Now
            </router-link>
            <router-link v-else to="/stations/new" class="btn btn-outline-secondary">
              Add Station
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style scoped>
.jumbotron {
  background-image: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), 
                    url('https://images.unsplash.com/photo-1593941707882-a5bba13938c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80');
  background-size: cover;
  background-position: center;
}
</style>
