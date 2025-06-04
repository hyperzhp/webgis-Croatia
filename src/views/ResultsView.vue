<template>
  <section class="main-container">
    <h2 class="mb-4 fw-semibold text-primary">Key Results</h2>

    <!-- Three pollutant rows: PM2.5, NO₂, OM10 -->
    <div class="row g-4 mt-3" v-for="pollutant in pollutantCards" :key="pollutant.name">
      <!-- Left column: Time‐series plot -->
      <div class="col-md-7">
        <div class="card shadow-sm h-100">
          <div class="card-img-placeholder" :class="{ filled: pollutant.plot }">
            <template v-if="pollutant.plot">
              <img :src="pollutant.plot" :alt="pollutant.plotTitle" />
            </template>
            <template v-else>
              Plot
            </template>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ pollutant.plotTitle }}</h5>
            <p class="card-text">{{ pollutant.plotText }}</p>
          </div>
        </div>
      </div>

      <!-- Right column: Population‐exposure pie chart -->
      <div class="col-md-5">
        <div class="card shadow-sm h-100">
          <div class="card-img-placeholder" :class="{ filled: pollutant.pie }">
            <template v-if="pollutant.pie">
              <img :src="pollutant.pie" :alt="pollutant.pieTitle" />
            </template>
            <template v-else>
              Pie
            </template>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ pollutant.pieTitle }}</h5>
            <p class="card-text">{{ pollutant.pieText }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import plotImg from '@/assets/plot.png'
import piechart from '@/assets/piechart.png'
import plotImg2 from '@/assets/plot_no2.png'
import piechartNo2 from '@/assets/piechart_no22.png'// "C:\Users\Majid\Documents\GitHub\webgis-Croatia\src\assets\piechart_no2.PNG"
const pollutantCards = [
  {
    name: 'PM2.5',
    plot: plotImg,
    plotTitle: 'PM2.5 Time-Series',
    plotText: 'Max and mean values for each year between 2013 and 2022.',
    pie: piechart,
    pieTitle: 'Population Exposure (2020) – PM2.5',
    pieText: 'Percentage of Croatia’s population living in each PM2.5 concentration class.'
  },
  {
    name: 'NO₂',
    plot: plotImg2,
    plotTitle: 'NO₂ Time-Series',
    plotText: 'Max and mean values for each year between 2013 and 2022.',
    pie: piechartNo2,
    pieTitle: 'Population Exposure (2020) – NO₂',
    pieText: 'Percentage of Croatia’s population living in each NO₂ concentration class.'
  },
  {
    name: 'OM10',
    plot: plotImg,
    plotTitle: 'OM10 Time-Series',
    plotText: 'Max and mean values for each year between 2013 and 2022.',
    pie: piechart,
    pieTitle: 'Population Exposure (2020) – OM10',
    pieText: 'Percentage of Croatia’s population living in each OM10 concentration class.'
  }
]
</script>

<style scoped>
.main-container {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
}

.card-img-placeholder {
  position: relative;
  height: 180px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.9rem;
  overflow: hidden;
  transition: height 0.3s;
}

.card-img-placeholder.filled {
  height: auto;
}

.card-img-placeholder.filled img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>
