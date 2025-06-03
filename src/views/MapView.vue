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

  // 3️⃣ Define GeoServer overlay layers
  const geoServerUrl = 'ftp://gisgeoserver_04@www.gis-geoserver.polimi.it:2121/geoserver'

  // Create WMS layers from your GeoServer instance
  const annualDifLayer = L.tileLayer.wms(`${geoServerUrl}/wms`, {
    layers: 'htdocs-SSL:Annual_dif_in_av_conc_from_5_year_mean',
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer - Air Quality Data'
  })

  const avgConcentrationMonthlyLayer = L.tileLayer.wms(`${geoServerUrl}/wms`, {
    layers: 'htdocs-SSL:Average_concentration_monthly',
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer - Air Quality Data'
  })

  const avgConcentrationYearlyLayer = L.tileLayer.wms(`${geoServerUrl}/wms`, {
    layers: 'htdocs-SSL:Average_concentration_yearly',
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer - Air Quality Data'
  })

  const avgConcentrationYearlyMapsLayer = L.tileLayer.wms(`${geoServerUrl}/wms`, {
    layers: 'htdocs-SSL:Average_concentration_yearly_maps',
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer - Air Quality Data'
  })

  const populationExposureLayer = L.tileLayer.wms(`${geoServerUrl}/wms`, {
    layers: 'htdocs-SSL:Population_exposure',
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer - Air Quality Data'
  })

  const urbanConcentrationLayer = L.tileLayer.wms(`${geoServerUrl}/wms`, {
    layers: 'htdocs-SSL:Urban_concentration_yearly_max_mean',
    format: 'image/png',
    transparent: true,
    attribution: 'GeoServer - Air Quality Data'
  })

  // 4️⃣ Alternative: Vector layers (GeoJSON from WFS)
  // Uncomment and modify if you prefer vector data
  /*
  const vectorLayer = L.layerGroup()
  
  // Fetch GeoJSON data from GeoServer WFS
  fetch(`${geoServerUrl}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=your_workspace:your_layer&outputFormat=application/json`)
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: {
          color: '#ff0000',
          weight: 2,
          opacity: 0.8
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties) {
            layer.bindPopup(Object.keys(feature.properties).map(key => 
              `<b>${key}:</b> ${feature.properties[key]}`
            ).join('<br>'))
          }
        }
      }).addTo(vectorLayer)
    })
    .catch(error => console.error('Error loading vector data:', error))
  */

  // 5️⃣ Define base maps and overlay layers
  const baseMaps = {
    'OpenStreetMap': osm,
    'ESRI World Imagery': esri
  }

  const overlayMaps = {
    'Annual Difference in Average Concentration': annualDifLayer,
    'Average Concentration (Monthly)': avgConcentrationMonthlyLayer,
    'Average Concentration (Yearly)': avgConcentrationYearlyLayer,
    'Average Concentration (Yearly Maps)': avgConcentrationYearlyMapsLayer,
    'Population Exposure': populationExposureLayer,
    'Urban Concentration (Max Mean)': urbanConcentrationLayer
  }

  // 6️⃣ Add layer control with checkboxes for overlays
  L.control.layers(baseMaps, overlayMaps, {
    position: 'topright',
    collapsed: false  // Keep it expanded to show checkboxes
  }).addTo(map)

  // 7️⃣ Optional: Add some layers by default
  // avgConcentrationYearlyLayer.addTo(map)
  // populationExposureLayer.addTo(map)

  // 8️⃣ Add mouse-position control
  const mousePos = L.control({ position: 'bottomleft' })
  mousePos.onAdd = () => {
    const div = L.DomUtil.create('div', 'mouse-position')
    div.innerHTML = 'Lat: --, Lng: --'
    return div
  }
  mousePos.addTo(map)

  // 9️⃣ Update coordinates on mousemove
  map.on('mousemove', (e) => {
    const { lat, lng } = e.latlng
    document.querySelector('.mouse-position').innerHTML =
      `Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}`
  })

  // 🔟 Optional: Handle layer events
  map.on('overlayadd', (e) => {
    console.log(`Layer added: ${e.name}`)
  })

  map.on('overlayremove', (e) => {
    console.log(`Layer removed: ${e.name}`)
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

/* Mouse position styling */
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

/* Custom layer control styling */
.leaflet-control-layers {
  max-height: 300px;
  overflow-y: auto;
}

.leaflet-control-layers-expanded {
  min-width: 200px;
}
</style>