<template>
  <nav class="navbar-modern navbar-expand-lg" :class="{ scrolled: isScrolled }">
    <div class="container">
      <!-- Enhanced Brand Section -->
      <router-link to="/" class="navbar-brand">
        <div class="brand-container">
          <div class="brand-flag-wrapper">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Croatia.svg" alt="Croatia Flag"
              class="brand-flag" />
            <div class="flag-glow"></div>
          </div>
          <div class="brand-text-wrapper">
            <span class="brand-text-main">Croatia WebGIS</span>
            <span class="brand-text-sub">Geospatial Analytics</span>
          </div>
        </div>
      </router-link>

      <!-- Enhanced Mobile Toggle -->
      <button class="navbar-toggler" type="button" :aria-expanded="isMenuOpen" aria-controls="modernNavbar"
        aria-label="Toggle navigation" @click="toggleMenu">
        <div class="hamburger-lines" :class="{ active: isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <!-- Enhanced Navigation Menu -->
      <div class="navbar-collapse" :class="{ show: isMenuOpen }" id="modernNavbar">
        <ul class="navbar-nav ms-auto">
          <li v-for="(item, index) in items" :key="item.name" class="nav-item"
            :style="{ '--delay': index * 0.1 + 's' }">
            <router-link :to="item.path" class="nav-link" :class="{
              active: $route.name === item.name,
              'nav-notification': item.hasNotification,
              'has-updates': item.hasUpdates
            }" @click="closeMenu">
              <div class="nav-link-content">
                <div class="nav-icon-wrapper">
                  <i :class="item.icon" class="nav-icon"></i>
                  <div v-if="item.hasNotification" class="notification-badge">
                    <span class="notification-pulse"></span>
                  </div>
                  <div v-if="item.hasUpdates" class="update-indicator">
                    <i class="fas fa-circle"></i>
                  </div>
                </div>
                <span class="nav-text">{{ item.label }}</span>
              </div>
              <div class="nav-link-bg"></div>
            </router-link>
          </li>
        </ul>

        <!-- Mobile Menu Overlay -->
        <div class="mobile-menu-overlay" :class="{ show: isMenuOpen }" @click="closeMenu"></div>
      </div>
    </div>

    <!-- Navbar Background Blur -->
    <div class="navbar-bg-blur"></div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isScrolled = ref(false)
const isMenuOpen = ref(false)

const items = [
  {
    name: 'home',
    path: '/',
    label: 'Home',
    icon: 'fas fa-home'
  },
  {
    name: 'webgis',
    path: '/webgis',
    label: 'WebGIS',
    icon: 'fas fa-globe-europe',
    hasNotification: true,
    hasUpdates: true
  },
  {
    name: 'methods',
    path: '/methods',
    label: 'Methods',
    icon: 'fas fa-microscope'
  },
  {
    name: 'results',
    path: '/results',
    label: 'Results',
    icon: 'fas fa-chart-line'
  },
  {
    name: 'dataset',
    path: '/dataset',
    label: 'Dataset',
    icon: 'fas fa-database'
  },
  {
    name: 'team',
    path: '/team',
    label: 'Team',
    icon: 'fas fa-users'
  }
]

// Handle scroll effect
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// Toggle mobile menu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  // Prevent body scroll when menu is open
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : 'auto'
}

// Close mobile menu
const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = 'auto'
}

// Handle clicks outside menu to close it
const handleClickOutside = (event) => {
  const navbar = event.target.closest('.navbar-modern')
  if (!navbar && isMenuOpen.value) {
    closeMenu()
  }
}

// Handle escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = 'auto'
})

// Watch for route changes to close mobile menu
watch(() => route.path, () => {
  closeMenu()
})
</script>

<style scoped>
/* ============================================
   ENHANCED NAVBAR STYLES
   ============================================ */
.navbar-modern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: var(--navbar-height, 90px);
}

.navbar-modern.scrolled {
  padding: 0.5rem 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(24, 100, 171, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  height: var(--navbar-height, 70px);
}

/* Container for navbar content */
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ============================================
   ENHANCED BRAND SECTION
   ============================================ */
.navbar-brand {
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1001;
}

.navbar-brand:hover {
  transform: translateY(-2px);
  text-decoration: none;
  color: inherit;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.brand-flag-wrapper {
  position: relative;
  width: 50px;
  height: 35px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.brand-flag-wrapper:hover {
  transform: scale(1.1) rotate(2deg);
  box-shadow: 0 8px 25px rgba(24, 100, 171, 0.3);
}

.brand-flag {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.flag-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(24, 100, 171, 0.1) 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.brand-flag-wrapper:hover .flag-glow {
  opacity: 1;
}

.brand-text-wrapper {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-text-main {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.scrolled .brand-text-main {
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-text-sub {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--primary-blue);
  opacity: 0.8;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: -2px;
  transition: all 0.3s ease;
}

.scrolled .brand-text-sub {
  color: var(--accent-blue);
}

/* ============================================
   ENHANCED MOBILE TOGGLE
   ============================================ */
.navbar-toggler {
  border: none;
  background: rgba(24, 100, 171, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1001;
}

.navbar-toggler:hover {
  background: rgba(24, 100, 171, 0.2);
  transform: scale(1.05);
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 3px rgba(24, 100, 171, 0.3);
}

.hamburger-lines {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-lines span {
  display: block;
  height: 3px;
  width: 100%;
  background: var(--primary-blue);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center;
}

.hamburger-lines.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-lines.active span:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.hamburger-lines.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* ============================================
   ENHANCED NAVIGATION MENU
   ============================================ */
.navbar-nav {
  gap: 0.5rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  position: relative;
  padding: 0.75rem 1.25rem;
  border-radius: 15px;
  text-decoration: none;
  color: var(--primary-blue);
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid transparent;
  display: block;
}

.nav-link-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.nav-icon {
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.nav-text {
  transition: all 0.3s ease;
}

.nav-link-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light) 100%);
  z-index: 1;
  transition: left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-link:hover {
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(24, 100, 171, 0.25);
  border-color: rgba(255, 255, 255, 0.2);
  text-decoration: none;
}

.nav-link:hover .nav-link-bg {
  left: 0;
}

.nav-link:hover .nav-icon {
  transform: scale(1.1) rotate(5deg);
}

.nav-link.active {
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light) 100%);
  color: #fff;
  box-shadow: 0 6px 20px rgba(24, 100, 171, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-link.active .nav-link-bg {
  left: 0;
}

.nav-link.active .nav-icon {
  transform: scale(1.05);
}

/* ============================================
   NOTIFICATION AND UPDATE INDICATORS
   ============================================ */
.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  background: var(--accent-green);
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--accent-green);
  animation: pulse-notification 2s infinite;
}

@keyframes pulse-notification {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.update-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  color: var(--accent-purple);
  font-size: 0.5rem;
  animation: blink 1.5s infinite;
}

@keyframes blink {

  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0.3;
  }
}

/* ============================================
   MOBILE MENU ENHANCEMENTS
   ============================================ */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
}

.mobile-menu-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 991.98px) {
  .navbar-modern {
    height: var(--navbar-height, 80px);
  }

  .navbar-modern.scrolled {
    height: var(--navbar-height, 60px);
  }

  .navbar-collapse {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 400px;
    height: 100vh;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    padding: 6rem 0 2rem 0;
    transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1000;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
    border-left: 1px solid rgba(24, 100, 171, 0.1);
  }

  .navbar-collapse.show {
    right: 0;
  }

  .navbar-nav {
    flex-direction: column;
    padding: 0 2rem;
    gap: 0.75rem;
  }

  .nav-item {
    animation: slideInRight 0.5s ease-out both;
    animation-delay: var(--delay);
  }

  .nav-link {
    padding: 1rem 1.5rem;
    border-radius: 20px;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .nav-link-content {
    gap: 1rem;
  }

  .nav-icon-wrapper {
    width: 40px;
    height: 40px;
    background: rgba(24, 100, 171, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }

  .nav-icon {
    font-size: 1.2rem;
  }

  .nav-text {
    font-size: 1rem;
    font-weight: 600;
  }

  .brand-text-main {
    font-size: 1.3rem;
  }

  .brand-text-sub {
    font-size: 0.7rem;
  }

  .brand-flag-wrapper {
    width: 45px;
    height: 30px;
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 576px) {
  .navbar-modern {
    height: var(--navbar-height, 70px);
  }

  .navbar-modern.scrolled {
    height: var(--navbar-height, 50px);
  }

  .navbar-collapse {
    width: 90%;
  }

  .brand-container {
    gap: 0.75rem;
  }

  .brand-text-main {
    font-size: 1.2rem;
  }

  .brand-text-sub {
    font-size: 0.65rem;
  }

  .brand-flag-wrapper {
    width: 40px;
    height: 28px;
  }

  .navbar-toggler {
    width: 45px;
    height: 45px;
  }

  .hamburger-lines {
    width: 20px;
    height: 16px;
  }
}

/* ============================================
   ACCESSIBILITY IMPROVEMENTS
   ============================================ */
@media (prefers-reduced-motion: reduce) {

  .navbar-modern,
  .nav-link,
  .hamburger-lines span,
  .navbar-collapse,
  .notification-pulse {
    transition: none;
    animation: none;
  }
}

.nav-link:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

.navbar-toggler:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* ============================================
   DARK MODE SUPPORT (if needed)
   ============================================ */
@media (prefers-color-scheme: dark) {
  .navbar-modern {
    background: rgba(44, 62, 80, 0.9);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .navbar-modern.scrolled {
    background: rgba(44, 62, 80, 0.95);
  }

  .nav-link {
    color: #e2e8f0;
  }

  .navbar-collapse {
    background: rgba(44, 62, 80, 0.98);
  }
}
</style>