<template>
  <div class="methods-container">
    <!-- Dot‐nav for quick jump -->
    <nav class="methods-nav">
      <ul>
        <li v-for="(step, idx) in steps" :key="idx" :class="{ active: currentStep === idx }" @click="scrollTo(idx)">
        </li>
      </ul>
    </nav>

    <!-- Scroll‐snap wrapper -->
    <div class="methods-snap" @scroll="onScroll" ref="snap">
      <section v-for="(step, idx) in steps" :key="idx" class="step-split"
        :class="['step-split', { reverse: idx === 0 }]">
        <!-- Left: step text -->
        <div class="step-text">
          <h2 class="step-title">{{ step.title }}</h2>
          <p class="step-desc">{{ step.desc }}</p>
          <ul class="step-details">
            <li v-for="(d, j) in step.details" :key="j">• {{ d }}</li>
          </ul>

          <!-- 🔹 Insert concentration‐levels table only on step index 1 -->
          <template v-if="idx === 1">
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
          </template>

          <!-- 🔹 Insert legend image only on step index 6 (7th page) -->
          <template v-if="idx === 6">
            <div class="legend-container">
              <img :src="legendImg" alt="Bivariate legend" class="legend-image" />
            </div>
          </template>
        </div>

        <!-- Right: image or placeholder -->
        <div class="step-image">
          <!-- 1️⃣ Annual aggregation -->
          <template v-if="idx === 0">
            <div class="image-panel-content">
              <img :src="aggExampleImg" alt="PM2.5 aggregation example" />
            </div>
          </template>

          <!-- 2️⃣ Concentration comparison -->
          <template v-else-if="idx === 1">
            <div class="image-panel-content">
              <img :src="concMap" alt="PM2.5 concentration comparison" />
            </div>
          </template>

          <!-- 3️⃣ Annual average difference -->
          <template v-else-if="idx === 2">
            <div class="image-panel-content">
              <img :src="add" alt="Annual average difference map" />
            </div>
          </template>

          <!-- 4️⃣ Land-Cover Reclassification -->
          <template v-else-if="idx === 3">
            <div class="image-panel-content">
              <img :src="reclassified" alt="Land-cover reclassification map" />
            </div>
          </template>

          <!-- 5️⃣ Zonal Statistics -->
          <template v-else-if="idx === 4">
            <div class="image-panel-content">
              <img :src="zonalStatsImg" alt="Zonal statistics visualization" />
            </div>
          </template>

          <!-- 6️⃣ Time Series Analysis -->
          <template v-else-if="idx === 5">
            <div class="image-panel-content">
              <img :src="timeSeriesImg" alt="Time series analysis chart" />
            </div>
          </template>

          <!-- 7️⃣ Validation & Results -->
          <template v-else-if="idx === 6">
            <div class="image-panel-content">
              <img :src="validationImg" alt="Validation results visualization" />
            </div>
          </template>

          <!-- Fallback for any additional steps -->
          <template v-else>
            <div class="step-image-placeholder">
              <!-- Placeholder for additional content -->
            </div>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import aggExampleImg from '@/assets/pm25.png'
import concMap from '@/assets/concentration_map.png'
import add from '@/assets/add.png'
import reclassified from '@/assets/reclassified.png'
import zonalStatsImg from '@/assets/zonal.png'
import timeSeriesImg from '@/assets/mmm.png'
import validationImg from '@/assets/zzz.png'
import legendImg from '@/assets/legend.png'

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

const currentStep = ref(0)
const snap = ref(null)

function scrollTo(idx) {
  snap.value.children[idx].scrollIntoView({ behavior: 'smooth' })
}

function onScroll() {
  const container = snap.value
  currentStep.value = Math.round(container.scrollTop / container.clientHeight)
}
</script>
