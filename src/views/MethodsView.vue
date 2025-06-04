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
      <section v-for="(step, idx) in steps" :key="idx" class="step-split" :class="{ reverse: idx === 0 }">
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
                      <th>
                        Concentration<br>
                        levels
                      </th>
                      <th>
                        NO<sub>2</sub><br>
                        [µg/m<sup>3</sup>]
                      </th>
                      <th>
                        PM<sub>2.5</sub><br>
                        [µg/m<sup>3</sup>]
                      </th>
                      <th>
                        PM<sub>10</sub><br>
                        [µg/m<sup>3</sup>]
                      </th>
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
.methods-container {
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 1rem;
}

.methods-nav {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 0.5rem;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.methods-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.methods-nav li {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(24, 100, 171, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.methods-nav li.active {
  background: var(--primary-blue);
  transform: scale(1.2);
}

.nav-tooltip {
  position: absolute;
  right: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--primary-blue);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.methods-nav li:hover .nav-tooltip {
  opacity: 1;
  visibility: visible;
}

.methods-snap {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.step-split {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  padding: 2rem;
  scroll-snap-align: start;
}

.step-text {
  flex: 1;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.step-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.step-desc {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.step-details {
  list-style: none;
  padding: 0;
  margin: 0;
}

.step-details li {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-image {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.image-panel-content {
  position: relative;
  cursor: zoom-in;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-panel-content:hover .image-overlay {
  opacity: 1;
}

.zoom-hint {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.zoom-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.zoom-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.zoom-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.zoom-close {
  position: absolute;
  top: -20px;
  right: -20px;
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.zoom-close:hover {
  transform: scale(1.1);
  background: var(--primary-blue);
  color: white;
}

.table-section {
  width: 100%;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
}

.table-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.class-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.class-table th,
.class-table td {
  padding: 1rem;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.class-table th {
  background: #4dabf7;
  color: white;
  font-weight: 500;
  font-size: 1.1rem;
  line-height: 1.4;
  white-space: nowrap;
}

.class-table td {
  font-size: 1.05rem;
  background: white;
  color: #2d3748;
}

.class-table tr:nth-child(even) td {
  background: #f0f7ff;
}

.class-table th sub {
  font-size: 0.7em;
  vertical-align: sub;
  margin-left: 1px;
}

.class-table th sup {
  font-size: 0.7em;
  vertical-align: super;
  margin-left: 1px;
}

/* Column widths */
.class-table th:first-child,
.class-table td:first-child {
  width: 25%;
}

.class-table th:not(:first-child),
.class-table td:not(:first-child) {
  width: 25%;
}

/* Dark mode table styles */
@media (prefers-color-scheme: dark) {
  .table-container {
    background: #2d3748;
  }

  .class-table td {
    background: #2d3748;
    color: #e2e8f0;
    border-color: #4a5568;
  }

  .class-table tr:nth-child(even) td {
    background: #2c3a4f;
  }

  .class-table th {
    background: #2c5282;
    border-color: #4a5568;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-container {
    margin: 0 1rem;
  }

  .class-table {
    font-size: 0.9rem;
  }

  .class-table th,
  .class-table td {
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .table-container {
    margin: 0 0.5rem;
  }

  .class-table {
    font-size: 0.8rem;
  }

  .class-table th,
  .class-table td {
    padding: 0.5rem 0.25rem;
  }
}

.nav-arrow {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-arrow.prev {
  top: 20px;
}

.nav-arrow.next {
  bottom: 20px;
}

.nav-arrow:hover {
  transform: translateX(-50%) scale(1.1);
  background: white;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .methods-nav {
    background: rgba(44, 62, 80, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .step-text,
  .step-image {
    background: rgba(44, 62, 80, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .step-desc,
  .step-details li {
    color: rgba(255, 255, 255, 0.8);
  }

  .nav-arrow {
    background: rgba(44, 62, 80, 0.9);
    color: white;
  }

  .nav-arrow:hover {
    background: var(--primary-blue);
  }

  .nav-tooltip {
    background: rgba(44, 62, 80, 0.95);
    color: white;
  }

  .table-toggle {
    background: rgba(44, 62, 80, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .table-toggle:hover {
    background: var(--primary-blue);
  }

  .zoom-close {
    background: rgba(44, 62, 80, 0.9);
    color: white;
  }
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .nav-arrow {
    display: none;
  }

  .methods-nav {
    right: 0.5rem;
  }

  .nav-tooltip {
    display: none;
  }

  .methods-snap {
    height: auto;
    min-height: 100vh;
  }

  .step-split {
    flex-direction: column;
    gap: 2rem;
    padding: 1.5rem;
    height: auto;
    min-height: 100vh;
  }

  .step-text,
  .step-image {
    max-width: 100%;
    padding: 1.5rem;
  }

  .step-title {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .methods-container {
    padding: 0.5rem;
  }

  .methods-nav {
    display: none;
  }

  .step-split {
    padding: 1rem;
    gap: 1.5rem;
  }

  .step-text,
  .step-image {
    padding: 1rem;
  }

  .step-title {
    font-size: 1.75rem;
  }

  .step-desc {
    font-size: 1rem;
  }

  .zoom-content {
    padding: 1rem;
  }

  .zoom-close {
    top: -15px;
    right: -15px;
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
}
</style>
