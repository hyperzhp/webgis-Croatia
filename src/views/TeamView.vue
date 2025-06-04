<template>
  <div class="container-fluid croatia-bg">
    <!-- Header -->
    <div class="row justify-content-center mb-5">
      <div class="col-lg-8 text-center">
        <h1 class="display-4 fw-bold text-white mb-4">Meet Our Team</h1>
        <p class="lead text-white-50">
          MSc Geoinformatics Engineering students at Politecnico di Milano
        </p>
      </div>
    </div>

    <!-- Team Cards -->
    <div class="row justify-content-center g-4 mb-5">
      <div v-for="member in members" :key="member.id" class="col-lg-4 col-md-6">
        <div class="team-card">
          <div class="team-card-inner">
            <div class="team-card-front glass-card">
              <img :src="member.avatar" :alt="member.name" class="team-avatar-large mb-4">
              <h4 class="mb-2 text-center">{{ member.name }}</h4>
              <p class="text-muted text-center">{{ member.role }}</p>
            </div>
            <div class="team-card-back glass-card-dark">
              <h5 class="text-white mb-3 text-center">About {{ member.name.split(' ')[0] }}</h5>
              <p class="text-white-50 mb-4 text-center">{{ member.bio }}</p>
              <div class="team-social-links">
                <a v-if="member.email" :href="`mailto:${member.email}`" class="btn btn-outline-light btn-sm me-2"
                  :title="`Email ${member.name}`">
                  <i class="fas fa-envelope me-1"></i>
                  Email
                </a>
                <a v-if="member.linkedin" :href="member.linkedin" target="_blank"
                  class="btn btn-outline-light btn-sm me-2" :title="`${member.name} on LinkedIn`">
                  <i class="fab fa-linkedin-in me-1"></i>
                  LinkedIn
                </a>
                <a v-if="member.github" :href="member.github" target="_blank" class="btn btn-outline-light btn-sm"
                  :title="`${member.name} on GitHub`">
                  <i class="fab fa-github me-1"></i>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Info -->
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="glass-card">
          <div class="card-body p-4">
            <div class="d-flex align-items-center mb-3">
              <i class="fas fa-globe-europe text-white fs-3 me-3"></i>
              <h3 class="text-white mb-0">Croatia WebGIS Project</h3>
            </div>
            <p class="text-white-50 mb-3">
              Advanced air quality monitoring system using Vue 3, Leaflet, and GeoServer for
              real-time environmental data visualization across Croatia.
            </p>
            <div>
              <span class="badge bg-primary me-2">
                <i class="fab fa-vuejs me-1"></i>Vue 3
              </span>
              <span class="badge bg-success me-2">
                <i class="fas fa-map me-1"></i>OpenLayers
              </span>
              <span class="badge bg-warning me-2">
                <i class="fas fa-server me-1"></i>GeoServer
              </span>
              <span class="badge bg-info">
                <i class="fab fa-bootstrap me-1"></i>Bootstrap
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import majidImg from '@/assets/majid_snow.png'
import hyperImg from '@/assets/hyper.png'
import zhenyaImg from '@/assets/zhenya.png'

const members = ref([
  {
    id: 1,
    name: 'Haipeng Zhu',
    avatar: hyperImg,
    bio: 'Specialized in backend development and geospatial data processing. Expert in Python and API development for environmental monitoring systems.',
    email: 'haipeng.zhu@mail.polimi.it',
    linkedin: 'https://linkedin.com/in/haipeng-zhu',
    github: 'https://github.com/haipeng-zhu'
  },
  {
    id: 2,
    name: 'Rohollah Naeijian',
    avatar: majidImg,
    bio: 'Leading our team with expertise in GIS analysis and remote sensing. Coordinates project development and ensures technical excellence.',
    email: 'rohollah.naeijian@mail.polimi.it',
    linkedin: 'https://linkedin.com/in/rohollah-naeijian',
    github: 'https://github.com/rohollah-naeijian'
  },
  {
    id: 3,
    name: 'Evgenii Miasnikov',
    avatar: zhenyaImg,
    bio: 'Specializes in visualizing complex environmental and geospatial datasets through interactive web applications. Developed complete map interfaces with multiple toggleable layers, legends, and responsive UX using Vue.js, OpenLayers, and GeoServer.',
    email: 'evgenii.miasnikov@mail.polimi.it',
    linkedin: 'www.linkedin.com/in/evgenii-miasnikov-721948227',
    github: 'https://github.com/EVMiasnikov'
  }
])
</script>

<style scoped>
.team-avatar-large {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.team-card:hover .team-avatar-large {
  transform: scale(1.05);
}

.team-social-links {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
}

.team-social-links .btn {
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.team-social-links .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
}

.team-social-links .btn i {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .team-avatar-large {
    width: 140px;
    height: 140px;
  }

  .team-social-links .btn {
    min-width: 120px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .team-avatar-large {
    width: 120px;
    height: 120px;
  }

  .team-social-links .btn {
    min-width: 100px;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>