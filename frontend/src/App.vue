<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">EV Charging Station</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/stations">Stations</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/map">Map View</router-link>
            </li>
          </ul>
          <ul class="navbar-nav" v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
          </ul>
          <ul class="navbar-nav" v-else>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                {{ user.username }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><router-link class="dropdown-item" to="/profile">Profile</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container py-4">
      <router-view />
    </main>

    <footer class="footer mt-auto py-3 bg-light">
      <div class="container text-center">
        <span class="text-muted">EV Charging Station Management System &copy; {{ new Date().getFullYear() }}</span>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters(['isLoggedIn', 'user'])
  },
  methods: {
    ...mapActions(['logout'])
  },
  mounted() {
    // Ensure Bootstrap's JavaScript is properly initialized
    // This will make dropdowns, modals, and other interactive elements work
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .then(() => {
        console.log('Bootstrap JS initialized successfully');
      })
      .catch(error => {
        console.error('Failed to initialize Bootstrap JS:', error);
      });
  }
}
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css';

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.navbar-brand {
  font-weight: bold;
}

.footer {
  margin-top: auto;
}

/* Use forced-colors media query instead of -ms-high-contrast */
@media (forced-colors: active) {
  .btn-primary {
    background-color: Highlight;
    border-color: Highlight;
    color: HighlightText;
  }
  
  .btn-secondary {
    background-color: ButtonFace;
    border-color: ButtonText;
    color: ButtonText;
  }
  
  .btn-danger {
    background-color: Highlight;
    border-color: Highlight;
    color: HighlightText;
  }
  
  .navbar-dark {
    background-color: Highlight !important;
    color: HighlightText !important;
  }
  
  .card {
    border-color: ButtonText;
  }
}
</style>
