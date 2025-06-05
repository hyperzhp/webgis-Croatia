<template>
  <div class="methods-container">
    <!-- Navigation dots -->
    <nav class="methods-nav">
      <ul>
        <li v-for="(step, idx) in steps" :key="idx" :class="{ active: currentStep === idx }" @click="scrollTo(idx)"
          :title="step.title">
          <span class="nav-tooltip">{{ step.title }}</span>
        </li>
      </ul>
    </nav>

    <!-- Step navigation buttons -->
    <button class="nav-arrow prev" @click="goToPrevStep" v-show="currentStep > 0" aria-label="Previous step">
      <i class="fas fa-chevron-up"></i>
    </button>
    <button class="nav-arrow next" @click="goToNextStep" v-show="currentStep < steps.length - 1" aria-label="Next step">
      <i class="fas fa-chevron-down"></i>
    </button>

    <!-- Main content -->
    <div class="methods-snap" @scroll="onScroll" ref="snap">
      <section v-for="(step, idx) in steps" :key="idx" class="step-split">
        <div class="step-text">
          <h2 class="step-title">{{ step.title }}</h2>
          <p class="step-desc">{{ step.desc }}</p>
          <ul class="step-details">
            <li v-for="(d, j) in step.details" :key="j" class="detail-item">
              <i class="fas fa-check"></i>
              {{ d }}
            </li>
          </ul>

          <!-- Concentration levels table -->
          <template v-if="idx === 1">
            <div class="table-section">
              <div class="table-container">
                <table class="class-table">
                  <thead>
                    <tr>
                      <th>Concentration levels</th>
                      <th>NO₂ [µg/m³]</th>
                      <th>PM₂.₅ [µg/m³]</th>
                      <th>PM₁₀ [µg/m³]</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>≤ 10</td>
                      <td>≤ 5</td>
                      <td>≤ 15</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>&gt; 10 & ≤ 25</td>
                      <td>&gt; 5 & ≤ 10</td>
                      <td>&gt; 15 & ≤ 31</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>&gt; 25 & ≤ 40</td>
                      <td>&gt; 10 & ≤ 20</td>
                      <td>&gt; 31 & ≤ 40</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>&gt; 40 & ≤ 50</td>
                      <td>&gt; 20 & ≤ 25</td>
                      <td>&gt; 40 & ≤ 50</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>&gt; 50</td>
                      <td>&gt; 25</td>
                      <td>&gt; 50</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>

          <!-- Legend image -->
          <template v-if="idx === 6">
            <div class="legend-container">
              <img :src="legendImg" alt="Bivariate legend" class="legend-image" @click="toggleImageZoom(legendImg)" />
            </div>
          </template>
        </div>

        <!-- Interactive image panels -->
        <div class="step-image" @click="toggleImageZoom(getStepImage(idx))">
          <div class="image-panel-content">
            <img :src="getStepImage(idx)" :alt="step.title" />
            <div class="image-overlay">
              <span class="zoom-hint">
                <i class="fas fa-search-plus"></i>
                Click to zoom
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Image zoom overlay -->
    <div class="zoom-overlay" v-if="isImageZoomed" @click="closeZoom">
      <div class="zoom-content" @click.stop>
        <img :src="zoomedImage" alt="Zoomed image" />
        <button class="zoom-close" @click="closeZoom">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import aggExampleImg from '@/assets/pm25.png'
import concMap from '@/assets/concentration_map.png'
import add from '@/assets/add.png'
import reclassified from '@/assets/reclassified.png'
import zonalStatsImg from '@/assets/zonal.png'
import timeSeriesImg from '@/assets/mmm.png'
import validationImg from '@/assets/zzz.png'
import legendImg from '@/assets/legend.png'

const currentStep = ref(0)
const snap = ref(null)
const isImageZoomed = ref(false)
const zoomedImage = ref(null)

const steps = [
  {
    title: 'Yearly Aggregated Pollutants',
    desc: `After clipping all monthly CAMS rasters (12× per year) we compute an annual-mean map for each pollutant to highlight long-term trends.`,
    details: [
      'Inputs: 12 monthly GeoTIFFs per pollutant (2013–2022)',
      'Tool: QGIS r.series → average aggregation',
      'Batch runs to produce 10 years × 3 pollutants',
      'Outputs: Croatia_average_{pollutant}_{year}.tif',
    ]
  },
  {
    title: 'Yearly Concentration Maps',
    desc: `To assess EU compliance, we reclassify the 2020 annual-mean maps into five classes based on EU limit-value thresholds.`,
    details: [
      'Thresholds: NO₂=40 µg/m³, PM₂.₅=25 µg/m³, PM₁₀=40 µg/m³',
      'Tool: QGIS Reclassify by Table',
      'Outputs: Croatia_{pollutant}_concentration_2020.tif',
    ]
  },
  {
    title: 'Annual Avg Difference from 5-Year Mean',
    desc: `We compute 2022 minus the 2017–2021 mean for each pollutant to map anomalies—positive indicates deterioration, negative improvement.`,
    details: [
      'Inputs: 2022 annual mean + 2017–2021 mean rasters',
      'Tool: QGIS Raster Calculator ("avg2022" - "mean2017_2021")',
      'Styling: diverging color ramp centered at zero',
      'Outputs: Croatia_{pollutant}_anomaly_2022.tif + SLD file',
    ]
  },
  {
    title: 'Land-Cover Reclassification to IPCC Schema',
    desc: `To make our land-cover data compatible with the IPCC's broad categories, we reclassify the 2022 ESA CCI map (22 classes) into six general classes for easier analysis.`,
    details: [
      'Source: ESA CCI 2022 NetCDF (lccs_class band), clipped to Croatia',
      'Reproject to WGS84 (EPSG:4326)',
      'Reclassification table → 6 classes: Forest, Cropland, Urban, Grassland, Wetland, Snow/Ice',
      'Tool: QGIS Reclassify by Table → Output: Croatia_LC_reclassified_2022.tif',
    ]
  },
  {
    title: 'Multi-Year Zonal Statistics of Pollutant Exposure',
    desc: `To quantify pollutant variation by land-cover type, we compute zonal stats (min/max) for each pollutant over 2013–2022, then export time-series attributes.`,
    details: [
      'Inputs: Reclassified LC raster + annual-mean pollutant rasters (2013–2022)',
      'Polygonize LC → select Urban → dissolve to one feature',
      'Join raster stats (min/max) per year via QGIS Zonal Statistics',
      'Export: Croatia_<pollutant>_zonal_statistics_2013-2022.gpkg',
    ]
  },
  {
    title: 'Population Exposure 2020',
    desc: `We downloaded high-resolution population counts for Croatia (2020) from WorldPop, clipped to our national boundary, reprojected to WGS84, and classified into five equal-quantile classes using QGIS's r.quantiles tool.`,
    details: [
      'Source: WorldPop Population Counts, Croatia 2020',
      'Resolution: ~100 m (0.01°)',
      'Clipped to GAUL L0 boundary & reprojected to EPSG:4326',
      'Classification: 5 quantile classes via QGIS r.quantiles',
      'Output: Croatia_population_quantile_2020.tif',
    ]
  },
  {
    title: 'Bivariate Map:',
    desc: `To highlight where dense population overlaps poor air quality, we combined our 2020 pollutant concentration classes with the 2020 population quantiles into a 5×5 bivariate scheme. Each cell is uniquely colored to show high-risk exposure zones.`,
    details: [
      'Inputs: Croatia_pm25_concentration_2020.tif & Croatia_population_quantile_2020.tif',
      'Zonal stats → pollutant_max × pop_median per zone',
      'Bivariate field: pol_max * 10 + pop_med',
      'Styled with 5×5 QGIS bivariate color ramp',
      'Output: Croatia_pm25_2020_bivariate.gpkg + legend graphic',
    ]
  }
]

// Enhanced scroll handling with smooth transitions
function scrollTo(idx) {
  if (snap.value) {
    const targetSection = snap.value.children[idx]
    targetSection.scrollIntoView({ behavior: 'smooth' })
    currentStep.value = idx
  }
}

function onScroll() {
  if (snap.value) {
    const container = snap.value
    const newStep = Math.round(container.scrollTop / container.clientHeight)
    if (currentStep.value !== newStep) {
      currentStep.value = newStep
      // Add analytics tracking here if needed
      console.log(`Viewing step: ${steps[newStep].title}`)
    }
  }
}

// Image zoom functionality
function toggleImageZoom(image) {
  if (!isImageZoomed.value) {
    zoomedImage.value = image
    isImageZoomed.value = true
    document.body.style.overflow = 'hidden'
  } else {
    closeZoom()
  }
}

function closeZoom() {
  isImageZoomed.value = false
  zoomedImage.value = null
  document.body.style.overflow = ''
}

// Navigation functions
function goToNextStep() {
  if (currentStep.value < steps.length - 1) {
    scrollTo(currentStep.value + 1)
  }
}

function goToPrevStep() {
  if (currentStep.value > 0) {
    scrollTo(currentStep.value - 1)
  }
}

// Keyboard navigation
function handleKeyPress(e) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    goToNextStep()
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    goToPrevStep()
  } else if (e.key === 'Escape' && isImageZoomed.value) {
    closeZoom()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

// Helper function to get step image
function getStepImage(idx) {
  switch (idx) {
    case 0:
      return aggExampleImg
    case 1:
      return concMap
    case 2:
      return add
    case 3:
      return reclassified
    case 4:
      return zonalStatsImg
    case 5:
      return timeSeriesImg
    case 6:
      return validationImg
    default:
      return ''
  }
}
</script>

<style scoped>
/* 样式已移至 src/styles/methods.css */
</style>
