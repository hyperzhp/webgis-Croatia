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
    plotTitle: 'PM10 Time-Series Analysis',
    plotText: `Comprehensive analysis of PM10 concentration trends from 2013 to 2022, showing seasonal patterns and long-term changes in air quality.`,
    pie: piechart,
    pieTitle: 'Population Exposure Distribution (2020)',
    pieText: `Analysis of population distribution across PM10 concentration zones, identifying areas of concern and potential intervention needs.`,
  },
];
</script>

<style scoped>
.results-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.results-header {
  text-align: center;
  margin-bottom: 3rem;
}

.results-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.results-header .subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto;
}

.results-grid {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.pollutant-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.pollutant-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--primary-blue);
}

.cards-container {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2rem;
}

.result-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(24, 100, 171, 0.1);
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-img-container {
  position: relative;
  background: #f8faff;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid rgba(24, 100, 171, 0.1);
}

.card-img-container.filled {
  background: white;
}

.card-img-container img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.result-card:hover .card-img-container img {
  transform: scale(1.02);
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
}

.placeholder-content i {
  font-size: 2rem;
  opacity: 0.5;
}

.card-info {
  padding: 1.5rem;
  background: white;
}

.card-info h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-blue);
}

.card-info p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .pollutant-section {
    background: rgba(44, 62, 80, 0.9);
  }

  .result-card {
    background: #1a2234;
  }

  .card-img-container {
    background: #212b42;
  }

  .card-info {
    background: #1a2234;
  }

  .card-info p {
    color: rgba(255, 255, 255, 0.8);
  }
}

/* Responsive design */
@media (max-width: 1200px) {
  .results-container {
    padding: 1.5rem;
  }

  .cards-container {
    gap: 1.5rem;
  }
}

@media (max-width: 991.98px) {
  .cards-container {
    grid-template-columns: 1fr;
  }

  .card-img-container {
    min-height: 200px;
  }
}

@media (max-width: 768px) {
  .results-container {
    padding: 1rem;
  }

  .results-header h2 {
    font-size: 2rem;
  }

  .pollutant-title {
    font-size: 1.5rem;
  }

  .pollutant-section {
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .results-header {
    margin-bottom: 2rem;
  }

  .results-grid {
    gap: 2rem;
  }

  .card-img-container {
    min-height: 180px;
  }

  .card-info {
    padding: 1rem;
  }
}
</style>
