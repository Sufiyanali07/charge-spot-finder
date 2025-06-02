<template>
  <div class="register-page">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Register</h3>
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
            
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="username"
                  required
                  placeholder="Choose a username"
                >
              </div>
              
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
                  placeholder="Create a password"
                  minlength="6"
                >
                <div class="form-text">Password must be at least 6 characters long</div>
              </div>
              
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  required
                  placeholder="Confirm your password"
                >
                <div v-if="passwordMismatch" class="text-danger mt-1">
                  Passwords do not match
                </div>
              </div>
              
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="loading || passwordMismatch"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Register
                </button>
              </div>
            </form>
            
            <div class="mt-3 text-center">
              <p>Already have an account? <router-link to="/login">Login here</router-link></p>
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
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  computed: {
    ...mapGetters(['loading', 'error']),
    passwordMismatch() {
      return this.password && this.confirmPassword && this.password !== this.confirmPassword;
    }
  },
  methods: {
    ...mapActions(['register', 'clearError']),
    async handleRegister() {
      if (this.passwordMismatch) {
        return;
      }
      
      try {
        await this.register({
          username: this.username,
          email: this.email,
          password: this.password
        });
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  },
  created() {
    this.clearError();
  }
}
</script>

<style scoped>
.register-page {
  padding-top: 2rem;
}
</style>
