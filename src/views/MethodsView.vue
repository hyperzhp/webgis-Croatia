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
            <li v-for="(d, j) in step.details" :key="j">
              • {{ d }}
            </li>
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
                  <td>&gt;</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>&gt;</td>
                  <td>10</td>
                  <td>&le;</td>
                  <td>25</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>&gt;</td>
                  <td>25</td>
                  <td>&le;</td>
                  <td>40</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>&gt;</td>
                  <td>40</td>
                  <td>&le;</td>
                  <td>50</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>&gt;</td>
                  <td>50</td>
                </tr>
              </tbody>
            </table>
          </template>
        </div>

        <!-- Right: placeholder image panel -->
        <!-- Right panel: -->
        <div class="step-image">
          <template v-if="idx === 0">
            <div class="image-panel-content">
              <h3 class="image-title">PM₂.₅</h3>
              <img :src="aggExampleImg" alt="PM2.5 aggregation example" />
            </div>
          </template>
          <template v-else>
            <div class="step-image-placeholder"></div>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import aggExampleImg from '@/assets/croatia_avg_pm25_2014.png'

const steps = [
  {
    title: 'Yearly Aggregated Pollutants',
    desc: `After clipping all monthly CAMS rasters (12× per year) we compute an annual-mean map for each pollutant to highlight long-term trends.`,
    details: [
      'Inputs: 12 monthly GeoTIFFs per pollutant (2013–2022)',
      'Tool: QGIS r.series → average aggregation',
      'Batch runs to produce 10 years × 3 pollutants',
      'Outputs: Croatia_average_{pollutant}_{year}.tif'
    ]
  },
  {
    title: 'Yearly Concentration Maps',
    desc: `To assess EU compliance, we reclassify the 2020 annual-mean maps into five classes based on EU limit-value thresholds.`,
    details: [
      'Thresholds: NO₂=40 µg/m³, PM₂.₅=25 µg/m³, PM₁₀=40 µg/m³',
      'Tool: QGIS Reclassify by table',
      'Outputs: Croatia_{pollutant}_concentration_2020.tif'
    ]
  },
  {
    title: 'Annual Avg Difference from 5-Year Mean',
    desc: `We compute 2022 minus the 2017–2021 mean for each pollutant to map anomalies—positive indicates deterioration, negative improvement.`,
    details: [
      'Inputs: 2022 annual mean + 2017–2021 mean rasters',
      'Tool: QGIS Raster Calculator ("avg2022" - "mean2017_2021")',
      'Styling: diverging color ramp centered at zero',
      'Outputs: Croatia_{pollutant}_anomaly_2022.tif + SLD file'
    ]
  }
]

const currentStep = ref(0)
const snap = ref(null)

function scrollTo(idx) {
  const container = snap.value
  const child = container.children[idx]
  child.scrollIntoView({ behavior: 'smooth' })
}

function onScroll() {
  const container = snap.value
  const scrollTop = container.scrollTop
  const height = container.clientHeight
  currentStep.value = Math.round(scrollTop / height)
}
</script>

<style scoped>
.methods-container {
  position: relative;
}

/* Dot navigation */
.methods-nav {
  position: fixed;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  z-index: 10;
}

.methods-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.methods-nav li {
  width: 12px;
  height: 12px;
  margin: 8px 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}

.methods-nav li.active {
  background: #1864ab;
  transform: scale(1.3);
}

/* Scroll-snap wrapper */
.methods-snap {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

/* Each step full-screen split */
.step-split {
  display: grid;
  grid-template-columns: minmax(0, 600px) 1fr;
  scroll-snap-align: start;
  height: 100vh;
}

/* Text panel */
.step-text {
  background: linear-gradient(135deg, #1864ab, #4dabf7);
  color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.step-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.step-desc {
  font-size: 1.125rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.step-details {
  list-style: none;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1.4;
}

/* 🔹 Concentration-classes table styling */
.class-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}

.class-table th,
.class-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.class-table thead {
  background-color: #4dabf7;
  color: #fff;
}

.class-table tbody tr:nth-child(odd) {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Image panel */
.step-image {
  background: #fff url('https://placehold.co/800x600?text=Step+Image') center/contain no-repeat;
  min-height: 100px;
}

/* Mobile: stack and hide image */
@media (max-width: 768px) {
  .step-split {
    display: block;
    height: auto;
  }

  .step-image {
    display: none;
  }

  .step-text {
    padding: 2rem;
    text-align: center;
  }
}

/* 3-row grid for first step’s image */
.image-grid {
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  width: 100%;
  height: 100%;
}

.grid-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-row img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

/* placeholder for other steps */
.step-image-placeholder {
  width: 100%;
  height: 100%;
  background: #e0e0e0;
}

.step-split.reverse {
  /* swap so image‐grid (first child) comes left, text at right */
  grid-template-columns: 1fr minmax(0, 600px);
}

/* Center title + image together */
.image-content {
  flex-direction: column;
  gap: 0.5rem;
}

.image-title {
  color: #1864ab;
  font-size: 1.25rem;
  margin: 0;
}

.image-content img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

/* Container for the title + image inside the right panel */
.image-panel-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: #fff;
}

/* Title above the image */
.image-title {
  margin: 0;
  color: #1864ab;
  font-size: 1.5rem;
}

/* Image sizing */
.image-panel-content img {
  max-width: 90%;
  max-height: 70%;
  object-fit: contain;
}
</style>
