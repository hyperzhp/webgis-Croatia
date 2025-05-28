<template>
    <div id="map" class="full-map"></div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import L from 'leaflet'
  
  onMounted(() => {
    // 1️⃣ Define your two baselayers
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    })
  
    const esri = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, ' +
          'Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }
    )
  
    // 2️⃣ Initialize the map with OSM by default
    const map = L.map('map', {
      center: [45.1, 15.2],
      zoom: 7,
      layers: [osm]
    })
  
    // 3️⃣ Add basemap switcher
    const baseMaps = {
      'OpenStreetMap': osm,
      'ESRI World Imagery': esri
    }
    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map)
  
    // 4️⃣ Add mouse-position control
    const mousePos = L.control({ position: 'bottomleft' })
    mousePos.onAdd = () => {
      const div = L.DomUtil.create('div', 'mouse-position')
      div.innerHTML = 'Lat: --, Lng: --'
      return div
    }
    mousePos.addTo(map)
  
    // 5️⃣ Update coordinates on mousemove
    map.on('mousemove', (e) => {
      const { lat, lng } = e.latlng
      document.querySelector('.mouse-position').innerHTML =
        `Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}`
    })
  })
  </script>
  
  <style>
  .full-map {
    position: absolute;
    top: 64px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;
  }
  
  /* now this is global and will actually apply */
  .mouse-position {
    background: rgba(255, 255, 255, 0);
    padding: 0.3rem 0.6rem;
    font-size: 0.95rem !important;
    font-weight: bold !important;
    color: #000 !important;
    border-radius: 0.25rem;
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
    line-height: 1.2;
  }
  </style>
  