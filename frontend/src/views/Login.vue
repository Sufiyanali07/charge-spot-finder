<template>
  <div class="login-page">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Login</h3>
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
            
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  required
                  placeholder="Enter your email"
                >
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                  placeholder="Enter your password"
                >
              </div>
              
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Login
                </button>
              </div>
            </form>
            
            <div class="mt-3 text-center">
              <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters(['loading', 'error'])
  },
  methods: {
    ...mapActions(['login', 'clearError']),
    async handleLogin() {
      try {
        await this.login({
          email: this.email,
          password: this.password
        });
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  },
  created() {
    this.clearError();
  }
}
</script>

<style scoped>
.login-page {
  padding-top: 2rem;
}
</style>
