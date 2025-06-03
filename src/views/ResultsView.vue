<template>
  <section class="main-container">
    <h2 class="mb-4 fw-semibold text-primary">Key Results</h2>

    <!-- 1) First row of three cards -->
    <div class="row g-4">
      <div class="col-md-4" v-for="card in topCards" :key="card.title">
        <div class="card shadow-sm h-100">
          <div class="card-img-placeholder" :class="{ filled: card.image }">
            <template v-if="card.image">
              <img :src="card.image" alt="" />
            </template>
            <template v-else>
              Image
            </template>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text">{{ card.text }}</p>
            <router-link to="/webgis" class="stretched-link">View on Map</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 2) Second row: Built-up (7 cols) & Population (5 cols) -->
    <div class="row g-4 mt-3">
      <div v-for="(card, i) in bottomCards" :key="card.title" :class="i === 0 ? 'col-md-7' : 'col-md-5'">
        <div class="card shadow-sm h-100">
          <div class="card-img-placeholder" :class="{ filled: card.image }">
            <template v-if="card.image">
              <img :src="card.image" alt="" />
            </template>
            <template v-else>
              Chart
            </template>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text">{{ card.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 3) Third row: three equal parts (for future content) -->
    <div class="row g-4 mt-3">
      <div class="col-md-4" v-for="n in 3" :key="n">
        <div class="card shadow-sm h-100">
          <div class="card-img-placeholder">
            <!-- Replace with your own image/chart when ready -->
            Part {{ n }}
          </div>
          <div class="card-body">
            <h5 class="card-title">Title {{ n }}</h5>
            <p class="card-text">Description for part {{ n }}.</p>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import piechart from '@/assets/piechart.png'
import plotImg from '@/assets/plot.png'

const topCards = [
  /* ... unchanged ... */
]

const bottomCards = [
  {
    title: 'PM2.5 time-series',
    text: 'In this polt it can be seen the max and mean for each year between 2013 and 2022',
    image: plotImg
  },
  {
    title: 'Population Exposure (2020)',
    text: 'Percentage of Croatia’s population living in each pollutant concentration class.',
    image: piechart
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

/* when we have an image, let the placeholder grow to auto height */
.card-img-placeholder.filled {
  height: auto;
}

/* and force the img to fill width, keep its own aspect ratio */
.card-img-placeholder.filled img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>
