<template>
  <div class="webgis-container">
    <header class="header">
      <div class="logo-container">
        <img alt="Croatia WebGIS logo" src="./assets/logo.png">
        <h1>Croatia WebGIS</h1>
      </div>
      <nav class="main-nav">
        <ul>
          <li><a href="#" class="active">Home</a></li>
          <li><a href="#">Map</a></li>
          <li><a href="#">Data</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
    </header>

    <main class="main-content">
      <div class="sidebar">
        <h2>Map Layers</h2>
        <div class="layer-control">
          <div class="layer-item">
            <input type="checkbox" id="layer1" checked>
            <label for="layer1">Topography</label>
          </div>
          <div class="layer-item">
            <input type="checkbox" id="layer2">
            <label for="layer2">Roads</label>
          </div>
          <div class="layer-item">
            <input type="checkbox" id="layer3">
            <label for="layer3">Points of Interest</label>
          </div>
          <div class="layer-item">
            <input type="checkbox" id="layer4">
            <label for="layer4">Administrative Boundaries</label>
          </div>
        </div>

        <div class="search-container">
          <h2>Search Location</h2>
          <input type="text" placeholder="Search places in Croatia...">
          <button>Search</button>
        </div>
      </div>

      <div class="map-container">
        <div class="map-placeholder">
          <p>Map will be displayed here</p>
          <p>We'll integrate a mapping library like Leaflet or OpenLayers soon!</p>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>&copy; 2025 Croatia WebGIS | Developed with Vue.js</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
}

.webgis-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #3498db;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-container img {
  height: 40px;
  margin-right: 1rem;
}

.main-nav ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.main-nav li {
  margin-left: 1.5rem;
}

.main-nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem;
}

.main-nav a.active,
.main-nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.main-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 300px;
  background-color: #f5f5f5;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.layer-control {
  margin-bottom: 2rem;
}

.layer-item {
  margin-bottom: 0.5rem;
}

.search-container input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-container button {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-container button:hover {
  background-color: #2980b9;
}

.map-container {
  flex: 1;
  padding: 1rem;
}

.map-placeholder {
  background-color: #e0e0e0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  color: #666;
}

.footer {
  background-color: #34495e;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>