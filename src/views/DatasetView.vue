<template>
  <div class="datasets-page">
    <a v-for="(dataset, i) in datasets" :key="i" :href="dataset.url" target="_blank" class="dataset-split"
      :class="{ reverse: i % 2 === 1 }">
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
        <router-link :to="{ name: 'methods' }" class="enhanced-btn enhanced-btn-primary">
          <div>
            <i class="fas fa-microscope"></i>
          </div>
          <div class="btn-content">
            <span class="btn-title">View Methods</span>
            <span class="btn-subtitle">Explore our methodology</span>
          </div>
          <div>
            <i class="fas fa-arrow-right"></i>
          </div>
        </router-link>

        <router-link :to="{ name: 'results' }" class="enhanced-btn enhanced-btn-secondary">
          <div>
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="btn-content">
            <span class="btn-title">See Results</span>
            <span class="btn-subtitle">View our findings</span>
          </div>
          <div>
            <i class="fas fa-arrow-right"></i>
          </div>
        </router-link>

        <router-link :to="{ name: 'team' }" class="enhanced-btn enhanced-btn-accent">
          <div>
            <i class="fas fa-users"></i>
          </div>
          <div class="btn-content">
            <span class="btn-title">Contact Team</span>
            <span class="btn-subtitle">Meet our researchers</span>
          </div>
          <div>
            <i class="fas fa-arrow-right"></i>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import camsImg from '@/assets/CAMS.png'
import esriImg from '@/assets/esa_landcover_2022.png'
import popImg from '@/assets/worldpop_2020.png'
import gaulImg from '@/assets/gaul_boundaries.png'

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