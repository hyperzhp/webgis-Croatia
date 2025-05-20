<template>
  <header class="app-header">
    <div class="logo">
      <router-link to="/">WebGIS Croatia</router-link>
    </div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/map">Map</router-link>
      <router-link to="/about">About</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #2c3e50;
  color: white;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: #ddd;
  text-decoration: none;
  padding: 0.5rem;
}

nav a.router-link-active {
  color: white;
  font-weight: bold;
}
</style>