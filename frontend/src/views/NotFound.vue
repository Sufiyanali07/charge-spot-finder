<template>
  <div class="not-found text-center py-5">
    <div class="error-container">
      <h1 class="display-1">404</h1>
      <h2 class="mb-4">Page Not Found</h2>
      <p class="lead mb-4">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <router-link to="/" class="btn btn-primary btn-lg">
        <i class="bi bi-house-door"></i> Go to Homepage
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css");

.not-found {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-container {
  max-width: 600px;
}

.display-1 {
  font-size: 8rem;
  font-weight: 700;
  color: #dc3545;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
