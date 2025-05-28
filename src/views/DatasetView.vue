<template>
  <div class="datasets-page">
    <section
      v-for="(d, i) in datasets"
      :key="i"
      class="dataset-split"
      :class="{ 'reverse': i % 2 === 1 }"
    >
      <!-- Text panel -->
      <div class="dataset-text">
        <h2 class="dataset-title">{{ d.title }}</h2>
        <p class="dataset-desc">{{ d.description }}</p>
        <ul class="dataset-info">
          <li v-for="(info, j) in d.details" :key="j">
            <strong>{{ info.label }}:</strong> {{ info.value }}
          </li>
        </ul>
      </div>

      <!-- Image panel -->
      <div
        class="dataset-image"
        :style="{ backgroundImage: `url(${d.image})` }"
      ></div>
    </section>
  </div>
</template>

<script setup>

// Import your real asset images:
import camsImg      from '@/assets/CAMS.png'
import esriImg      from '@/assets/esa_landcover_2022.png'
import popImg       from '@/assets/worldpop_2020.png'
import gaulImg      from '@/assets/gaul_boundaries.png'

const datasets = [
  {
    title: 'CAMS Air-Quality Reanalysis',
    description:
      'The Copernicus Atmosphere Monitoring Service (CAMS) Air-Quality Reanalysis delivers a continuous, model-based record of major pollutants across Europe. By fusing multiple chemistry transport models with surface observations, it provides consistent hourly maps of gases and particulates—ideal for detecting seasonal hot-spots and long-term trends.',
    details: [
      { label: 'Resolution',     value: '≈0.1° (~10 km)' },
      { label: 'Period',         value: 'Jan 2013 – Dec 2022 (hourly)' },
      { label: 'Pollutants',     value: 'NO₂, PM₂.₅, PM₁₀ (plus O₃, CO, SO₂)' },
      { label: 'Format',         value: 'NetCDF & GeoTIFF' },
      { label: 'Source',         value: 'Copernicus Atmosphere Data Store (ADS)' }
    ],
    image: camsImg
  },
  {
    title: 'ESA CCI Land-Cover (2022)',
    description:
      'ESA’s Climate Change Initiative (CCI) Land-Cover maps classify Earth’s surface into 22 FAO categories at 300 m resolution. We reclassify these into 11 IPCC-standard classes (e.g. Forest, Cropland, Urban) to analyse how land use influences pollutant patterns and exposure.',
    details: [
      { label: 'Resolution',     value: '300 m' },
      { label: 'Year',           value: '2022 snapshot' },
      { label: 'Classes',        value: '22 FAO → 11 IPCC categories' },
      { label: 'Format',         value: 'NetCDF / GeoTIFF' },
      { label: 'Source',         value: 'Copernicus Climate Data Store (CDS)' }
    ],
    image: esriImg
  },
  {
    title: 'WorldPop Population Grid (2020)',
    description:
      'WorldPop’s gridded dataset estimates population counts per 100 m cell, produced via census disaggregation and ancillary data (roads, land cover). This layer reveals Croatia’s population distribution, enabling us to quantify how many people live in high-pollution areas.',
    details: [
      { label: 'Resolution',     value: '100 m' },
      { label: 'Year',           value: '2020' },
      { label: 'Units',          value: 'persons per cell' },
      { label: 'Format',         value: 'GeoTIFF' },
      { label: 'Source',         value: 'WorldPop data portal' }
    ],
    image: popImg
  },
  {
    title: 'FAO GAUL Administrative Boundaries',
    description:
      'The FAO Global Administrative Unit Layers (GAUL) provide official polygons for countries and sub-national regions. We use the country-level (L0) boundary to clip all datasets to Croatia and support any regional breakdown in our analyses.',
    details: [
      { label: 'Levels',         value: 'L0 (country), L1 (region), L2 (province)' },
      { label: 'Geometry',       value: 'Vector (GeoPackage / Shapefile)' },
      { label: 'Format',         value: 'GeoPackage / Shapefile' },
      { label: 'Source',         value: 'FAO GAUL repository' }
    ],
    image: gaulImg
  }
]
</script>



<style scoped>
.datasets-page {
  background: #f0f8ff;
}

/* Each split section */
.dataset-split {
  display: flex;
  flex-wrap: wrap;
  margin: 3rem auto;
  max-width: 1200px;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.1);
}

/* Alternate text/image order */
.dataset-split.reverse {
  flex-direction: row-reverse;
}

/* Text panel */
/* Text panel now 60% of the split */
.dataset-text {
  flex: 0 0 60%;
  padding: 2.5rem;
  background: #fff;          /* stays white */
}
.dataset-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #1864ab;
}
.dataset-desc {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}
.dataset-info {
  list-style: none;
  padding: 0;
  margin: 0;
}
.dataset-info li {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

/* Image panel now 40%, with white bg behind the image */
.dataset-image {
  flex: 0 0 40%;
  min-height: 300px;
  background-color: #fff;    /* white “canvas” around the image */
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;   /* scale image to fit within that 40% box */
}

/* Responsive: stack on mobile */
@media (max-width: 768px) {
  .dataset-split {
    flex-direction: column;
  }
  .dataset-image {
    height: 200px;
  }
}
</style>
