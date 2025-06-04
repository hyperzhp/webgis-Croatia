<template>
  <nav class="navbar-modern navbar-expand-lg" :class="{ scrolled: isScrolled }">
    <div class="container">
      <!-- Enhanced Brand Section -->
      <router-link to="/" class="navbar-brand" @click="closeMenu">
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

      <!-- Enhanced Mobile Toggle Button -->
      <button class="navbar-toggler" type="button" :aria-expanded="isMenuOpen" aria-controls="mobileNav"
        aria-label="Toggle navigation" @click="toggleMenu">
        <div class="hamburger-container">
          <span class="hamburger-line" :class="{ active: isMenuOpen }"></span>
          <span class="hamburger-line" :class="{ active: isMenuOpen }"></span>
          <span class="hamburger-line" :class="{ active: isMenuOpen }"></span>
        </div>
      </button>

      <!-- Enhanced Desktop Navigation -->
      <div class="desktop-nav">
        <ul class="navbar-nav">
          <li v-for="(item, index) in items" :key="item.name" class="nav-item"
            :style="{ '--delay': index * 0.1 + 's' }">
            <router-link :to="item.path" class="nav-link" :class="{ active: $route.name === item.name }">
              <div class="nav-link-content">
                <div class="nav-icon-wrapper">
                  <i :class="item.icon" class="nav-icon"></i>
                  <div v-if="item.hasNotification" class="notification-badge">
                    <span class="notification-pulse"></span>
                  </div>
                </div>
                <span class="nav-text">{{ item.label }}</span>
              </div>
              <div class="nav-link-bg"></div>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Enhanced Mobile Navigation Overlay -->
      <transition name="overlay">
        <div v-if="isMenuOpen" class="mobile-overlay" @click="closeMenu">
          <transition name="slide-in">
            <div class="mobile-nav" @click.stop>
              <div class="mobile-nav-header">
                <div class="mobile-header-content">
                  <div class="mobile-brand-mini">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Croatia.svg" alt="Croatia"
                      class="mobile-flag" />
                    <span class="mobile-title">Navigation</span>
                  </div>
                  <button class="mobile-close-btn" @click="closeMenu" aria-label="Close menu">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <div class="mobile-nav-body">
                <ul class="mobile-nav-list">
                  <li v-for="(item, index) in items" :key="item.name" class="mobile-nav-item"
                    :style="{ '--item-delay': index * 0.1 + 's' }">
                    <a :href="item.path" class="mobile-nav-link" :class="{ active: $route.name === item.name }"
                      @click="handleMobileNavClick(item.path)">
                      <div class="mobile-nav-content">
                        <div class="mobile-icon-wrapper">
                          <i :class="item.icon" class="mobile-nav-icon"></i>
                          <div v-if="item.hasNotification" class="mobile-notification-dot">
                            <span class="mobile-notification-pulse"></span>
                          </div>
                        </div>
                        <span class="mobile-nav-text">{{ item.label }}</span>
                        <i class="fas fa-chevron-right mobile-nav-arrow"></i>
                      </div>
                      <div class="mobile-nav-ripple"></div>
                    </a>
                  </li>
                </ul>

                <div class="mobile-nav-footer">
                  <div class="mobile-footer-text">
                    <span class="footer-main">Croatia WebGIS</span>
                    <span class="footer-sub">Geospatial Analytics Platform</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </div>

    <!-- Navbar Background Blur -->
    <div class="navbar-bg-blur"></div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isScrolled = ref(false)
const isMenuOpen = ref(false)

// Enhanced scroll effect with better performance
let scrollTimeout
const handleScroll = () => {
  if (scrollTimeout) {
    cancelAnimationFrame(scrollTimeout)
  }
  scrollTimeout = requestAnimationFrame(() => {
    isScrolled.value = window.scrollY > 20
  })
}

// Enhanced menu toggle with smooth transitions
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value

  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
    document.body.classList.add('menu-open')
  } else {
    document.body.style.overflow = ''
    document.body.classList.remove('menu-open')
  }
}

// Close menu with animation
const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
  document.body.classList.remove('menu-open')
}

// Enhanced mobile navigation with haptic feedback (if supported)
const handleMobileNavClick = (path) => {
  // Haptic feedback for mobile devices
  if (navigator.vibrate) {
    navigator.vibrate(50)
  }

  closeMenu()
  
  // Navigate and reset scroll
  router.push(path).then(() => {
    document.body.style.overflow = ''
    document.body.classList.remove('menu-open')
    window.scrollTo(0, 0)
  }).catch(err => {
    console.error('Navigation error:', err)
  })
}

// ESC key handling
const handleEscape = (event) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMenu()
  }
}

// Watch for route changes
watch(() => route.path, () => {
  closeMenu()
  // Reset scroll position and body styles
  document.body.style.overflow = ''
  document.body.classList.remove('menu-open')
  window.scrollTo(0, 0)
})

// Lifecycle management
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('keydown', handleEscape)
  // Reset body styles on mount
  document.body.style.overflow = ''
  document.body.classList.remove('menu-open')
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('keydown', handleEscape)
  // Reset body styles on unmount
  document.body.style.overflow = ''
  document.body.classList.remove('menu-open')

  if (scrollTimeout) {
    cancelAnimationFrame(scrollTimeout)
  }
})

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
    hasNotification: true
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
</script>

<style scoped>
/* ============================================
   CSS VARIABLES & THEMES
   ============================================ */
:root {
  --primary-blue: #1864ab;
  --primary-light: #339af0;
  --primary-dark: #0c4a6e;
  --accent-blue: #228be6;
  --accent-green: #51cf66;
  --accent-purple: #9775fa;
  --text-dark: #1e293b;
  --text-light: #64748b;
  --bg-glass: rgba(255, 255, 255, 0.95);
  --navbar-height: 85px;
  --navbar-height-scrolled: 65px;

  /* Glassmorphism effects */
  --glass-bg: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.18);
  --blur-amount: 16px;
}

/* Global body scroll control */
:global(body.menu-open) {
  position: fixed;
  width: 100%;
  overflow: hidden;
}

/* ============================================
   ENHANCED NAVBAR FOUNDATION
   ============================================ */
.navbar-modern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--bg-glass);
  backdrop-filter: blur(var(--blur-amount));
  -webkit-backdrop-filter: blur(var(--blur-amount));
  border-bottom: 1px solid rgba(24, 100, 171, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--navbar-height);
}

.navbar-modern.scrolled {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 8px 32px rgba(24, 100, 171, 0.12);
  height: var(--navbar-height-scrolled);
  border-bottom-color: rgba(24, 100, 171, 0.12);
}

.navbar-bg-blur {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(24, 100, 171, 0.02) 0%, rgba(51, 154, 240, 0.02) 100%);
  pointer-events: none;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
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
  z-index: 1001;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand-flag-wrapper:hover {
  transform: scale(1.08) rotate(2deg);
  box-shadow:
    0 8px 25px rgba(24, 100, 171, 0.25),
    0 3px 10px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(45deg, transparent 30%, rgba(24, 100, 171, 0.15) 70%);
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
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.brand-text-sub {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-light);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-top: -2px;
  transition: all 0.3s ease;
}

/* ============================================
   ENHANCED MOBILE TOGGLE
   ============================================ */
.navbar-toggler {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  padding: 0;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.navbar-toggler:hover {
  background: rgba(24, 100, 171, 0.1);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(24, 100, 171, 0.15);
}

.navbar-toggler:active {
  transform: scale(0.95);
}

.hamburger-container {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-line {
  width: 100%;
  height: 2.5px;
  background: var(--primary-blue);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* ============================================
   ENHANCED DESKTOP NAVIGATION
   ============================================ */
.desktop-nav {
  display: none;
}

@media (min-width: 992px) {
  .desktop-nav {
    display: block;
  }

  .navbar-toggler {
    display: none;
  }
}

.navbar-nav {
  display: flex;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-item {
  position: relative;
  opacity: 0;
  animation: fadeInNav 0.6s ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes fadeInNav {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-link {
  position: relative;
  display: block;
  padding: 0.875rem 1.25rem;
  color: var(--primary-blue);
  text-decoration: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid transparent;
  text-align: center;
  min-width: 120px;
}

.nav-link-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
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
  white-space: nowrap;
  text-align: center;
}

.nav-link-bg {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-blue) 100%);
  z-index: 1;
  transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover {
  color: #fff;
  transform: translateY(-3px);
  box-shadow:
    0 8px 25px rgba(24, 100, 171, 0.25),
    0 4px 10px rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  text-decoration: none;
}

.nav-link:hover .nav-link-bg {
  left: 0;
}

.nav-link:hover .nav-icon {
  transform: scale(1.15) rotate(8deg);
}

.nav-link.active {
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-blue) 100%);
  color: #fff;
  box-shadow:
    0 6px 20px rgba(24, 100, 171, 0.3),
    0 2px 6px rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-link.active .nav-link-bg {
  left: 0;
}

.nav-link.active .nav-icon {
  transform: scale(1.1);
}

/* Notification Badge */
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
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

/* ============================================
   ENHANCED MOBILE NAVIGATION
   ============================================ */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-in-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-in-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-in-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-in-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1500;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-top: var(--navbar-height);
}

.mobile-nav {
  width: 85%;
  max-width: 380px;
  height: calc(100vh - var(--navbar-height));
  background: linear-gradient(145deg, #ffffff 0%, #fafbff 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    -8px 0 32px rgba(0, 0, 0, 0.12),
    -4px 0 16px rgba(24, 100, 171, 0.08);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* Enhanced Mobile Nav Header */
.mobile-nav-header {
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, rgba(24, 100, 171, 0.05) 0%, rgba(51, 154, 240, 0.05) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(24, 100, 171, 0.08);
  z-index: 10;
}

.mobile-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
}

.mobile-brand-mini {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-flag {
  width: 28px;
  height: 20px;
  border-radius: 6px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.mobile-title {
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mobile-close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(24, 100, 171, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  color: var(--primary-blue);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-close-btn:hover {
  background: rgba(24, 100, 171, 0.15);
  transform: scale(1.05);
}

.mobile-close-btn:active {
  transform: scale(0.95);
}

/* Enhanced Mobile Nav Body */
.mobile-nav-body {
  padding: 1rem 0;
}

.mobile-nav-list {
  margin: 0;
  padding: 0 1rem;
  list-style: none;
}

.mobile-nav-item {
  margin: 0.5rem 0;
  opacity: 0;
  animation: slideInItem 0.5s ease-out forwards;
  animation-delay: calc(var(--item-delay) + 0.2s);
}

@keyframes slideInItem {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.mobile-nav-link {
  position: relative;
  display: block;
  text-decoration: none;
  color: var(--text-dark);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(24, 100, 171, 0.06);
  margin-bottom: 0.5rem;
}

.mobile-nav-link:hover {
  background: rgba(24, 100, 171, 0.05);
  transform: translateX(4px);
  text-decoration: none;
  color: var(--primary-blue);
  border-color: rgba(24, 100, 171, 0.15);
  box-shadow: 0 4px 20px rgba(24, 100, 171, 0.1);
}

.mobile-nav-link.active {
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-blue) 100%);
  color: white;
  border-color: var(--primary-blue);
  box-shadow: 0 6px 25px rgba(24, 100, 171, 0.25);
}

.mobile-nav-content {
  display: flex;
  align-items: center;
  padding: 1.2rem 1.5rem;
  position: relative;
  justify-content: space-between;
  width: 100%;
}

.mobile-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(24, 100, 171, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.mobile-nav-link:hover .mobile-icon-wrapper {
  background: rgba(24, 100, 171, 0.15);
  transform: scale(1.1);
}

.mobile-nav-link.active .mobile-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

.mobile-nav-icon {
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.mobile-nav-text {
  font-size: 1.05rem;
  font-weight: 600;
  flex: 1;
  text-align: center;
  transition: all 0.3s ease;
  margin-left: -40px;
  /* Offset the icon width to achieve true center */
}

.mobile-nav-arrow {
  font-size: 0.9rem;
  opacity: 0.5;
  transition: all 0.3s ease;
  margin-left: 1rem;
}

.mobile-nav-link:hover .mobile-nav-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.mobile-nav-link.active .mobile-nav-arrow {
  opacity: 1;
  color: white;
}

/* Mobile Notification Dot */
.mobile-notification-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background: var(--accent-green);
  border-radius: 50%;
  border: 2px solid white;
}

.mobile-notification-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--accent-green);
  animation: pulse 2s infinite;
}

/* Mobile Nav Ripple Effect */
.mobile-nav-ripple {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(24, 100, 171, 0.1) 0%, transparent 70%);
  transform: scale(0);
  transition: transform 0.3s ease;
  pointer-events: none;
}

.mobile-nav-link:active .mobile-nav-ripple {
  transform: scale(1);
}

/* Enhanced Mobile Nav Footer */
.mobile-nav-footer {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(24, 100, 171, 0.03) 0%, rgba(51, 154, 240, 0.03) 100%);
  border-top: 1px solid rgba(24, 100, 171, 0.08);
}

.mobile-footer-text {
  text-align: center;
}

.footer-main {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-blue) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.footer-sub {
  display: block;
  font-size: 0.8rem;
  color: var(--text-light);
  font-weight: 500;
}

/* ============================================
   RESPONSIVE ENHANCEMENTS
   ============================================ */
@media (max-width: 575px) {
  .mobile-overlay {
    justify-content: center;
    padding-top: var(--navbar-height);
  }

  .mobile-nav {
    width: 95%;
    max-width: none;
  }

  .brand-text-main {
    font-size: 1.3rem;
  }

  .brand-text-sub {
    font-size: 0.7rem;
  }

  .brand-flag-wrapper {
    width: 45px;
    height: 32px;
  }

  .navbar-toggler {
    width: 48px;
    height: 48px;
  }

  .mobile-nav-content {
    padding: 1rem 1.25rem;
  }

  .mobile-icon-wrapper {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .brand-container {
    gap: 0.75rem;
  }

  .mobile-header-content {
    padding: 1.25rem;
  }
}

/* ============================================
   ACCESSIBILITY & PERFORMANCE
   ============================================ */
@media (prefers-reduced-motion: reduce) {

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

.nav-link:focus-visible,
.mobile-nav-link:focus-visible,
.navbar-toggler:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-glass: rgba(15, 23, 42, 0.95);
    --text-dark: #f1f5f9;
    --text-light: #cbd5e1;
  }

  .navbar-modern {
    background: rgba(15, 23, 42, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .mobile-nav {
    background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  }

  .mobile-nav-link {
    background: rgba(30, 41, 59, 0.7);
    border-color: rgba(255, 255, 255, 0.06);
    color: #f1f5f9;
  }
}
</style>