<template>
  <div class="datasets-page">
    <a v-for="(dataset, i) in datasets" :key="i" :href="dataset.url" target="_blank" class="dataset-split"
      :class="{ reverse: i % 2 === 1 }" @click.prevent="handleDatasetClick(dataset)">
      <div class="dataset-text">
        <h2 class="dataset-title">{{ dataset.title }}</h2>
        <p class="dataset-desc">{{ dataset.description }}</p>
        <ul class="dataset-info">
          <li v-for="(info, j) in dataset.details" :key="j">
            <strong>{{ info.label }}:</strong> {{ info.value }}
          </li>
        </ul>
      </div>
      <div class="dataset-image" :style="{ backgroundImage: `url(${dataset.image})` }"></div>
    </a>

    <div class="dataset-footer">
      <div class="enhanced-buttons-container">
        <button class="enhanced-btn enhanced-btn-primary" @click="navigateToMethods">
          <i class="fas fa-microscope"></i>
          <div class="btn-content">
            <span class="btn-title">View Methods</span>
            <span class="btn-subtitle">Explore our methodology</span>
          </div>
          <i class="fas fa-arrow-right"></i>
        </button>

        <button class="enhanced-btn enhanced-btn-secondary" @click="navigateToResults">
          <i class="fas fa-chart-line"></i>
          <div class="btn-content">
            <span class="btn-title">See Results</span>
            <span class="btn-subtitle">View our findings</span>
          </div>
          <i class="fas fa-arrow-right"></i>
        </button>

        <button class="enhanced-btn enhanced-btn-accent" @click="navigateToTeam">
          <i class="fas fa-users"></i>
          <div class="btn-content">
            <span class="btn-title">Contact Team</span>
            <span class="btn-subtitle">Meet our researchers</span>
          </div>
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import camsImg from '@/assets/CAMS.png'
import esriImg from '@/assets/esa_landcover_2022.png'
import popImg from '@/assets/worldpop_2020.png'
import gaulImg from '@/assets/gaul_boundaries.png'

// Add navigation state management
import { useRouter } from 'vue-router'
const router = useRouter()

// Navigation functions
const navigateToMethods = () => {
  router.push({ name: 'methods' })
}

const navigateToResults = () => {
  router.push({ name: 'results' })
}

const navigateToTeam = () => {
  router.push({ name: 'team' })
}

// Dataset interaction handler
const handleDatasetClick = (dataset) => {
  // You can add analytics tracking here
  console.log(`Viewing dataset: ${dataset.title}`)
  window.open(dataset.url, '_blank')
}

const datasets = [
  {
    title: 'CAMS Air-Quality Reanalysis',
    description: 'The Copernicus Atmosphere Monitoring Service (CAMS) Air-Quality Reanalysis delivers a continuous, model-based record of major pollutants across Europe. By fusing multiple chemistry transport models with surface observations, it provides consistent hourly maps of gases and particulates—ideal for detecting seasonal hot-spots and long-term trends.',
    details: [
      { label: 'Resolution', value: '≈0.1° (~10 km)' },
      { label: 'Period', value: 'Jan 2013 – Dec 2022 (hourly)' },
      { label: 'Pollutants', value: 'NO₂, PM₂.₅, PM₁₀ (plus O₃, CO, SO₂)' },
      { label: 'Format', value: 'NetCDF & GeoTIFF' },
      { label: 'Source', value: 'Copernicus Atmosphere Data Store (ADS)' }
    ],
    image: camsImg,
    url: 'https://ads.atmosphere.copernicus.eu/cdsapp#!/dataset/cams-europe-air-quality-reanalyses'
  },
  {
    title: 'ESA CCI Land-Cover (2022)',
    description: 'ESA\'s Climate Change Initiative (CCI) Land-Cover maps classify Earth\'s surface into 22 FAO categories at 300 m resolution. We reclassify these into 11 IPCC-standard classes (e.g. Forest, Cropland, Urban) to analyse how land use influences pollutant patterns and exposure.',
    details: [
      { label: 'Resolution', value: '300 m' },
      { label: 'Year', value: '2022 snapshot' },
      { label: 'Classes', value: '22 FAO → 11 IPCC categories' },
      { label: 'Format', value: 'NetCDF / GeoTIFF' },
      { label: 'Source', value: 'Copernicus Climate Data Store (CDS)' }
    ],
    image: esriImg,
    url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/satellite-land-cover'
  },
  {
    title: 'WorldPop Population Grid (2020)',
    description: 'WorldPop\'s gridded dataset estimates population counts per 100 m cell, produced via census disaggregation and ancillary data (roads, land cover). This layer reveals Croatia\'s population distribution, enabling us to quantify how many people live in high-pollution areas.',
    details: [
      { label: 'Resolution', value: '100 m' },
      { label: 'Year', value: '2020' },
      { label: 'Units', value: 'persons per cell' },
      { label: 'Format', value: 'GeoTIFF' },
      { label: 'Source', value: 'WorldPop data portal' }
    ],
    image: popImg,
    url: 'https://hub.worldpop.org/geodata/summary?id=24777'
  },
  {
    title: 'FAO GAUL Administrative Boundaries',
    description: 'The FAO Global Administrative Unit Layers (GAUL) provide official polygons for countries and sub-national regions. We use the country-level (L0) boundary to clip all datasets to Croatia and support any regional breakdown in our analyses.',
    details: [
      { label: 'Levels', value: 'L0 (country), L1 (region), L2 (province)' },
      { label: 'Geometry', value: 'Vector (GeoPackage / Shapefile)' },
      { label: 'Format', value: 'GeoPackage / Shapefile' },
      { label: 'Source', value: 'FAO GAUL repository' }
    ],
    image: gaulImg,
    url: 'https://data.apps.fao.org/map/catalog/srv/eng/catalog.search#/metadata/9c35ba10-5649-41c8-bdfc-eb78e9e65654'
  }
]
</script>

<style scoped>
.datasets-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.dataset-split {
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.dataset-split::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.dataset-split:hover::after {
  opacity: 0.05;
}

.dataset-split:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(24, 100, 171, 0.1);
  border-color: rgba(24, 100, 171, 0.2);
}

.dataset-split.reverse {
  flex-direction: row-reverse;
}

.dataset-text {
  flex: 1;
  position: relative;
  z-index: 2;
}

.dataset-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dataset-desc {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.dataset-info {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dataset-info li {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
}

.dataset-info li strong {
  color: var(--primary-blue);
  margin-right: 0.5rem;
}

.dataset-image {
  flex: 1;
  height: 400px;
  border-radius: 15px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.dataset-image::before {
  content: 'View Dataset →';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 2rem;
  border-radius: 30px;
  color: var(--primary-blue);
  font-weight: 600;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dataset-split:hover .dataset-image::before {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.dataset-footer {
  text-align: center;
  padding: 2rem 0;
}

/* Enhanced buttons container */
.enhanced-buttons-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
}

.enhanced-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  text-decoration: none;
  color: var(--primary-blue);
  transition: all 0.3s ease;
  min-width: 250px;
}

.enhanced-btn i {
  font-size: 1.2rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-content {
  flex: 1;
  text-align: left;
}

.btn-title {
  display: block;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.btn-subtitle {
  display: block;
  font-size: 0.85rem;
  opacity: 0.8;
}

.enhanced-btn-primary {
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light) 100%);
  color: white;
}

.enhanced-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(24, 100, 171, 0.3);
}

.enhanced-btn-secondary {
  background: rgba(255, 255, 255, 0.9);
}

.enhanced-btn-secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: white;
}

.enhanced-btn-accent {
  background: rgba(var(--accent-green), 0.1);
  color: var(--accent-green);
  border-color: rgba(var(--accent-green), 0.2);
}

.enhanced-btn-accent:hover {
  transform: translateY(-3px);
  background: rgba(var(--accent-green), 0.15);
  box-shadow: 0 10px 30px rgba(var(--accent-green), 0.2);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .enhanced-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .enhanced-btn-primary {
    background: linear-gradient(135deg, var(--primary-blue) 0%, #1a4b7c 100%);
  }

  .enhanced-btn-secondary {
    background: rgba(255, 255, 255, 0.1);
  }

  .enhanced-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .dataset-image::before {
    background: rgba(44, 62, 80, 0.95);
    color: white;
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .datasets-page {
    gap: 2rem;
    padding: 1.5rem 1rem;
  }

  .dataset-split {
    flex-direction: column;
    gap: 2rem;
    padding: 1.5rem;
  }

  .dataset-split.reverse {
    flex-direction: column;
  }

  .dataset-image {
    width: 100%;
    height: 300px;
  }

  .dataset-title {
    font-size: 1.75rem;
  }

  .enhanced-buttons-container {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }

  .enhanced-btn {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 576px) {
  .datasets-page {
    gap: 1.5rem;
    padding: 1rem;
  }

  .dataset-split {
    padding: 1rem;
  }

  .dataset-image {
    height: 250px;
  }

  .dataset-title {
    font-size: 1.5rem;
  }

  .dataset-desc {
    font-size: 1rem;
  }

  .enhanced-btn {
    padding: 0.875rem 1.25rem;
  }

  .btn-title {
    font-size: 1rem;
  }

  .btn-subtitle {
    font-size: 0.8rem;
  }

  .dataset-image::before {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>