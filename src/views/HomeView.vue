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
                Explore monthly air quality maps for December 2022, annual averages for 2022, and “annual average
                difference” maps that show how 2022 compares to the 2017–2021 mean.
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
.hero-main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    max-width: 1400px;
    margin: 3rem auto 0 auto;
    border-radius: 2rem;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.99);
    min-height: 500px;
    gap: 0;
}

.hero-gallery {
    flex: 1.3;
    min-width: 0;
    display: flex;
    align-items: stretch;
}

.hero-swiper {
    width: 100%;
    min-height: 500px;
    background: #222;
    display: flex;
    align-items: stretch;
}

.hero-slide {
    position: relative;
    width: 100%;
    height: 500px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
}

.hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
    z-index: 1;
}

.slide-overlay {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(120deg, rgba(0, 80, 170, 0.15) 0%, rgba(0, 0, 0, 0.23) 100%);
    z-index: 2;
}

.slide-map {
    position: absolute;
    top: 15px;
    right: 20px;
    z-index: 4;
    width: 60px;
    height: 60px;
    border-radius: 8px;
    border: 1.5px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    background: #f7fbff;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
}

.slide-map:hover {
    transform: scale(1.2);
    z-index: 5;
}

.interactive-map {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
}

.map-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.2s ease;
    color: white;
    font-size: 0.6rem;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}

.slide-map:hover .map-overlay {
    opacity: 1;
}

.map-icon {
    font-size: 1rem;
    margin-bottom: 2px;
}

.slide-caption {
    position: absolute;
    left: 1.6rem;
    bottom: 2.1rem;
    background: rgba(15, 28, 44, 0.51);
    color: #fff;
    padding: 0.9rem 1.25rem 0.7rem 1.35rem;
    border-radius: 0.9rem;
    max-width: 340px;
    z-index: 3;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(1.5px);
}

.slide-caption h3 {
    font-size: 1.15rem;
    font-weight: 600;
    margin-bottom: 0.35rem;
    letter-spacing: 0.2px;
}

.slide-caption p {
    font-size: 0.98rem;
    line-height: 1.35;
    font-weight: 400;
    margin-bottom: 0;
}

.hero-context {
    flex: 1;
    background: linear-gradient(135deg, #1864ab 85%, #4dabf7 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.5rem;
    min-height: 500px;
    border-radius: 0 2rem 2rem 0;
}

.hero-context h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: 0.5px;
    line-height: 1.2;
}

.hero-context p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.5;
}

.hero-btn {
    display: inline-block;
    background: #fff;
    color: #1671c1;
    font-weight: 600;
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-size: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.09);
    transition: all 0.3s ease;
    border: none;
}

.hero-btn:hover {
    background: #1864ab;
    color: #fff;
    transform: translateY(-2px);
}

/* Swiper custom */
:deep(.swiper-pagination-bullet) {
    background: #fff !important;
    opacity: 0.8 !important;
    width: 10px;
    height: 10px;
}

:deep(.swiper-pagination-bullet-active) {
    background: #1864ab !important;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    color: #fff !important;
    background: rgba(24, 100, 171, 0.30);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    top: 50%;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.13));
}

:deep(.swiper-button-next) {
    right: 16px !important;
}

:deep(.swiper-button-prev) {
    left: 16px !important;
}

@media (max-width: 1050px) {
    .hero-main {
        flex-direction: column;
        border-radius: 1.2rem;
    }

    .hero-context,
    .hero-swiper {
        min-height: 350px;
    }

    .hero-context {
        padding: 2rem 1.5rem;
        border-radius: 0 0 1.2rem 1.2rem;
    }

    .hero-swiper {
        border-radius: 1.2rem 1.2rem 0 0;
    }

    .slide-map {
        width: 50px;
        height: 50px;
        top: 12px;
        right: 15px;
    }
}

@media (max-width: 640px) {
    .hero-context h1 {
        font-size: 1.07rem;
    }

    .hero-context p {
        font-size: 0.98rem;
    }

    .slide-caption {
        padding: 0.7rem 0.8rem;
        max-width: 97vw;
        left: 0.3rem;
        right: 0.3rem;
    }

    .hero-main {
        margin: 1rem auto 0 auto;
    }

    .slide-map {
        width: 45px;
        height: 45px;
        top: 10px;
        right: 10px;
    }
}
</style>