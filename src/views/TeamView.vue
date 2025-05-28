<template>
  <section class="team-section py-5">
    <!-- Section title + intro -->
    <h2 class="text-center mb-3">Team</h2>
    <p class="text-center text-muted mb-5">
      MSc Geoinformatics Engineering students at Politecnico di Milano, currently enrolled in the
      Geographic Information Systems course. We explore advanced geospatial analysis techniques
      and their practical applications.
    </p>

    <!-- Three columns with vertical separators -->
    <div class="row g-0">
      <div v-for="(m, i) in members" :key="m.name" class="col-md-4 d-flex flex-column align-items-center px-4"
        :class="{ 'border-end': i < members.length - 1 }">
        <h5 class="mb-3">{{ m.name }}</h5>
        <img :src="m.img" alt="" class="rounded-circle mb-3 team-photo" />
        <p class="text-muted mb-3 text-center">{{ m.bio }}</p>

        <!-- Social icons as circular images -->
        <div class="d-flex gap-3 mb-4">
          <!-- LinkedIn Icon -->
          <a v-if="m.linkedin" :href="m.linkedin" target="_blank" rel="noopener" class="social-btn">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" class="social-icon" />
          </a>

          <!-- Email Icon -->
          <a v-if="m.email" :href="`mailto:${m.email}`" class="social-btn">
            <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" class="social-icon" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// 1. Import your local images from src/assets
import majidImg from '@/assets/majid_snow.png'
import hyperImg from '@/assets/hyper.png'

const members = [
  {
    name: 'Haipeng Zhu',
    img: hyperImg,
    bio: 'Backend & Analytics – Majoring in Geoinformatics at Polimi.',
    linkedin: '#',
    email: 'hyper@example.com'
  },
  {
    name: 'Rohollah Naeijian',
    img: majidImg,
    bio:
      'Rohollah was born in Amol, Iran. He obtained his B.Sc. in Geomatics Engineering from Babol Nooshirvani University of Technology in 2023.',
    linkedin: 'https://www.linkedin.com/in/rohollah-naeijian/',
    email: 'naeijianrohollah@gmail.com'
  },
  {
    name: 'Zhenya',
    img: 'https://placehold.co/120x120?text=Zhenya',
    bio: 'Maps & Visualization – Specializing in WebGIS UX/UI.',
    linkedin: '#',
    email: 'zhenya@example.com'
  }
]
</script>

<style scoped>
.team-section {
  max-width: 1000px;
  margin: 0 auto;
}

/* Vertical borders between columns */
.border-end {
  border-right: 1px solid #e5e5e5;
}

/* Circular photo size */
.team-photo {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

/* Social icon buttons as circles */
.social-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
}

.social-btn:hover {
  background: #1864ab;
  border-color: #1864ab;
}

/* Actual icon images inside the buttons */
.social-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
</style>
