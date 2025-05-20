<template>
  <div class="webgis-container">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <img src="./assets/logo.png" alt="Croatia WebGIS" height="40" class="me-2">
          <span>Croatia WebGIS</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link active" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Map</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Data</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">About</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container-fluid p-0 main-content">
      <div class="row g-0">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 sidebar">
          <div class="p-3">
            <h5 class="mb-3">Map Layers</h5>
            <div class="mb-4">
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="layer1" checked>
                <label class="form-check-label" for="layer1">Topography</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="layer2">
                <label class="form-check-label" for="layer2">Roads</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="layer3">
                <label class="form-check-label" for="layer3">Points of Interest</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="layer4">
                <label class="form-check-label" for="layer4">Administrative Boundaries</label>
              </div>
            </div>

            <h5 class="mb-3">Search Location</h5>
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Search places in Croatia...">
              <button class="btn btn-primary" type="button">Search</button>
            </div>
          </div>
        </div>

        <!-- Map container -->
        <div class="col-md-9 col-lg-10 map-container">
          <div class="map-placeholder">
            <div class="text-center p-5">
              <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <h4>Map Loading</h4>
              <p class="text-muted">We'll integrate a mapping library like Leaflet or OpenLayers soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top"
      title="This is a Bootstrap tooltip">
      Hover over me
    </button>

    <footer class="bg-dark text-white py-3 text-center">
      <div class="container">
        <p class="mb-0">&copy; 2025 Croatia WebGIS | Developed with Vue.js and Bootstrap</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js')

  // Initialize tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  Array.from(tooltipTriggerList).forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })

  // Initialize popovers
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
  Array.from(popoverTriggerList).forEach(popoverTriggerEl => {
    new bootstrap.Popover(popoverTriggerEl)
  })
})
</script>

<style>
body {
  min-height: 100vh;
  margin: 0;
}

.webgis-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1 0 auto;
  display: flex;
}

.sidebar {
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  z-index: 1000;
}

.map-container {
  height: calc(100vh - 132px);
  /* Adjust based on your header and footer height */
  padding: 0;
}

.map-placeholder {
  background-color: #e9ecef;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    height: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .sidebar.show {
    transform: translateX(0);
  }

  .map-container {
    width: 100%;
  }
}
</style>