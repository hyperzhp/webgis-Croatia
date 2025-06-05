<template>
  <section class="results-container">
    <div class="results-header">
      <h2>Key Results</h2>
      <p class="subtitle">Analysis of air quality trends and population exposure in Croatia (2013-2022)</p>
    </div>

    <!-- Three pollutant rows: PM2.5, NO₂, PM10 -->
    <div class="results-grid">
      <div class="pollutant-section" v-for="pollutant in pollutantCards" :key="pollutant.name">
        <h3 class="pollutant-title">{{ pollutant.name }} Analysis</h3>

        <div class="cards-container">
          <!-- Time‐series plot card -->
          <div class="result-card plot-card">
            <div class="card-content">
              <div class="card-img-container" :class="{ 'filled': pollutant.plot }">
                <template v-if="pollutant.plot">
                  <img :src="pollutant.plot" :alt="pollutant.plotTitle">
                </template>
                <template v-else>
                  <div class="placeholder-content">
                    <i class="fas fa-chart-line"></i>
                    <span>Loading plot...</span>
                  </div>
                </template>
              </div>
              <div class="card-info">
                <h4>{{ pollutant.plotTitle }}</h4>
                <p>{{ pollutant.plotText }}</p>
              </div>
            </div>
          </div>

          <!-- Population‐exposure pie chart card -->
          <div class="result-card pie-card">
            <div class="card-content">
              <div class="card-img-container" :class="{ 'filled': pollutant.pie }">
                <template v-if="pollutant.pie">
                  <img :src="pollutant.pie" :alt="pollutant.pieTitle">
                </template>
                <template v-else>
                  <div class="placeholder-content">
                    <i class="fas fa-chart-pie"></i>
                    <span>Loading chart...</span>
                  </div>
                </template>
              </div>
              <div class="card-info">
                <h4>{{ pollutant.pieTitle }}</h4>
                <p>{{ pollutant.pieText }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import plotImg from '@/assets/plot.png';
import piechart from '@/assets/piechart.png';
import plotImg2 from '@/assets/plot_no2.png';
import piechartNo2 from '@/assets/piechart_no22.png';
import plotImg3 from '@/assets/plot_PM10.png';
import piechartPM10 from '@/assets/piechart_PM10.png';

const pollutantCards = [
  {
    name: 'PM2.5',
    plot: plotImg,
    plotTitle: 'PM2.5 Time-Series',
    plotText: 'Max and mean values for each year between 2013 and 2022.',
    pie: piechart,
    pieTitle: 'Population Exposure (2020) – PM2.5',
    pieText: 'Percentage of Croatia\'s population living in each PM2.5 concentration class.'
  },
  {
    name: 'NO₂',
    plot: plotImg2,
    plotTitle: 'NO₂ Time-Series',
    plotText: 'Max and mean values for each year between 2013 and 2022.',
    pie: piechartNo2,
    pieTitle: 'Population Exposure (2020) – NO₂',
    pieText: 'Percentage of Croatia\'s population living in each NO₂ concentration class.'
  },
  {
    name: 'PM10',
    plot: plotImg3,
    plotTitle: 'PM10 Time-Series Analysis',
    plotText: 'Comprehensive analysis of PM10 concentration trends from 2013 to 2022, showing seasonal patterns and long-term changes in air quality.',
    pie: piechartPM10,
    pieTitle: 'Population Exposure Distribution (2020)',
    pieText: 'Analysis of population distribution across PM10 concentration zones, identifying areas of concern and potential intervention needs.'
  }
];
</script>

<style scoped>
/* 样式已移至 src/styles/results.css */
</style>
