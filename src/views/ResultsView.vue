<template>
  <section class="main-container">
    <h2 class="mb-4 fw-semibold text-primary">Key Results</h2>

    <!-- First row of three cards -->
    <div class="row g-4">
      <div class="col-md-4" v-for="card in topCards" :key="card.title">
        <div class="card shadow-sm h-100">
          <!-- placeholder until real image -->
          <div class="card-img-placeholder">Image</div>
          <div class="card-body">
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text">{{ card.text }}</p>
            <router-link to="/webgis" class="stretched-link">View on Map</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Second row of two wider cards -->
    <div class="row g-4 mt-3">
      <div class="col-md-6" v-for="card in bottomCards" :key="card.title">
        <div class="card shadow-sm h-100">
          <div class="card-img-placeholder">Chart</div>
          <div class="card-body">
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text">{{ card.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const topCards = [
  {
    title: 'December 2022 Hot-spots',
    text: 'Monthly mean NO₂, PM₂.₅ & PM₁₀ highlight traffic corridors.'
  },
  {
    title: '2013–2022 Trend',
    text: 'All pollutants declined by ~18 % (except the 2020 lockdown dip).'
  },
  {
    title: '2022 vs 2017-2021 Mean',
    text: '+6 µg/m³ NO₂ anomaly in the industrial north; improvement on the coast.'
  }
]

const bottomCards = [
  {
    title: 'Built-up vs Forest',
    text: 'Built-up areas show 2× higher PM₂.₅ maxima than forests.'
  },
  {
    title: 'Population Exposure (2020)',
    text: '16 % of residents live in cells exceeding 40 µg/m³ NO₂.'
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
  box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.1);
}
.card-img-placeholder {
  height: 180px;
  background: #f0f0f0;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#999;
  font-size:0.9rem;
}
</style>
