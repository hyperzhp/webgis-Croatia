<template>
    <section class="hero-main">
        <div class="hero-gallery">
            <swiper :modules="[Navigation, Pagination, Autoplay]" :slides-per-view="1" :loop="true"
                :autoplay="{ delay: 4000, disableOnInteraction: false }" navigation pagination class="hero-swiper">
                <swiper-slide v-for="slide in slides" :key="slide.title" class="hero-slide">
                    <img :src="slide.img" :alt="slide.title" class="hero-img" />
                    <div class="slide-overlay"></div>
                    <div class="slide-map" @click="openMap(slide.coords, slide.title)">
                        <div :id="`map-${slide.id}`" class="interactive-map"></div>
                        <div class="map-overlay">
                            <span class="map-icon">📍</span>
                            <span class="map-text">View Map</span>
                        </div>
                    </div>
                    <div class="slide-caption">
                        <h3>{{ slide.title }}</h3>
                        <p>{{ slide.desc }}</p>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
        <div class="hero-context">
            <h1>Croatia Air-Quality WebGIS</h1>
            <p>
                This project combines high-resolution CAMS air pollution data (NO₂, PM₂.₅, PM₁₀) with ESA CCI land-cover
                maps (2013–2022) and detailed population grids to reveal air quality exposure patterns across Croatia.
                Explore monthly air quality maps for December 2022, annual averages for 2022, and "annual average
                difference" maps that show how 2022 compares to the 2017–2021 mean.
            </p>
            <router-link to="/methods" class="hero-btn">Explore Air Quality Maps</router-link>
        </div>
    </section>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Import your local images
import croatia1 from '@/assets/croatia1.jpg'
import croatia2 from '@/assets/croatia2.jpg'
import croatia3 from '@/assets/croatia3.jpg'
import croatia4 from '@/assets/croatia4.jpg'

// Leaflet for interactive maps
let L = null
const maps = {}

const slides = [
    {
        id: 'dubrovnik',
        img: croatia1,
        title: 'Dubrovnik Old Town & Fortress',
        desc: 'The legendary walled city of Dubrovnik—medieval stone walls, red rooftops, and the sparkling Adriatic.',
        coords: [42.640, 18.110]
    },
    {
        id: 'plitvice',
        img: croatia2,
        title: 'Plitvice Lakes National Park',
        desc: 'Crystal-clear turquoise lakes and lush waterfalls—Croatia\'s most iconic natural wonder.',
        coords: [44.880, 15.616]
    },
    {
        id: 'hvar',
        img: croatia3,
        title: 'Hvar Island at Sunset',
        desc: 'Romantic sunsets over Hvar\'s charming port and the golden light of the Dalmatian coast.',
        coords: [43.172, 16.443]
    },
    {
        id: 'cavtat',
        img: croatia4,
        title: 'Cavtat & Southern Dalmatia',
        desc: 'A picturesque bay ringed by green hills—Cavtat is a serene gem of southern Croatia.',
        coords: [42.581, 18.220]
    }
]

// Initialize Leaflet maps
const initMaps = async () => {
    // Dynamically import Leaflet
    const leaflet = await import('leaflet')
    L = leaflet.default

    // Import Leaflet CSS
    await import('leaflet/dist/leaflet.css')

    // Fix default marker icon issue
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
    })

    slides.forEach(slide => {
        const mapElement = document.getElementById(`map-${slide.id}`)
        if (mapElement) {
            const map = L.map(mapElement, {
                zoomControl: false,
                attributionControl: false,
                dragging: true,
                scrollWheelZoom: true,
                doubleClickZoom: true,
                boxZoom: false,
                keyboard: false,
                touchZoom: true
            }).setView(slide.coords, 12)

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: ''
            }).addTo(map)

            // Add custom marker with popup
            const marker = L.marker(slide.coords).addTo(map)
            marker.bindPopup(`<b>${slide.title}</b><br>Click to explore more`)

            maps[slide.id] = map
        }
    })
}

// Open full map (interactive function)
const openMap = (coords, title) => {
    // Option 1: Open in new tab with OpenStreetMap
    window.open(`https://www.openstreetmap.org/#map=15/${coords[0]}/${coords[1]}`, '_blank')

    // Option 2: You can also navigate to your map view
    // router.push({ name: 'Map', query: { lat: coords[0], lng: coords[1], location: title } })

    // Option 3: Show a modal with larger map
    console.log(`Opening detailed map for ${title} at coordinates:`, coords)
}

onMounted(() => {
    // Initialize maps after component is mounted
    setTimeout(initMaps, 100)
})

onUnmounted(() => {
    // Clean up maps
    Object.values(maps).forEach(map => {
        if (map && map.remove) {
            map.remove()
        }
    })
})
</script>

<style scoped>
/* 样式已移至 src/styles/home.css */
</style>