<template>
  <div id="app-shell">
    <!-- App Loading Overlay -->
    <div class="app-loading-overlay" :class="{ fade: !isLoading }">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="loading-text">Croatia WebGIS</div>
      </div>
    </div>

    <!-- Navigation Bar -->
    <NavBar />

    <!-- Main Content Area -->
    <main class="site-main">
      <!-- Page Transition Container -->
      <div class="page-container">
        <transition name="page-slide" mode="out-in">
          <router-view :key="$route.fullPath" />
        </transition>
      </div>

      <!-- Scroll to Top Button -->
      <button class="scroll-to-top" :class="{ visible: showScrollTop }" @click="scrollToTop" aria-label="Scroll to top">
        <i class="fas fa-chevron-up"></i>
      </button>
    </main>

    <!-- Footer -->
    <FooterBar />

    <!-- Global App Overlays -->
    <div class="app-overlays">
      <!-- Loading States -->
      <div class="route-loading" :class="{ active: isRouteLoading }">
        <div class="route-progress-bar"></div>
      </div>

      <!-- Notification System -->
      <div class="notification-container">
        <transition-group name="notification" tag="div">
          <div v-for="notification in notifications" :key="notification.id" class="notification-item"
            :class="notification.type">
            <i :class="getNotificationIcon(notification.type)"></i>
            <span>{{ notification.message }}</span>
            <button @click="removeNotification(notification.id)" class="notification-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Background Effects -->
    <div class="app-background-effects">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'

const route = useRoute()

// App state
const isLoading = ref(true)
const isRouteLoading = ref(false)
const showScrollTop = ref(false)
const notifications = ref([])

// Handle scroll effects
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

// Scroll to top functionality
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Route loading indicator
watch(() => route.path, async () => {
  isRouteLoading.value = true
  await nextTick()
  setTimeout(() => {
    isRouteLoading.value = false
  }, 500)
})

// Notification system
const addNotification = (message, type = 'info', duration = 5000) => {
  const id = Date.now()
  notifications.value.push({ id, message, type })

  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const getNotificationIcon = (type) => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }
  return icons[type] || icons.info
}

// Initialize app
onMounted(() => {
  // Initialize navbar functionality
  if (window.NavBarState) {
    window.NavBarState.init()
  }

  // Add scroll listener
  window.addEventListener('scroll', handleScroll)

  // App loading simulation
  setTimeout(() => {
    isLoading.value = false
  }, 1500)

  // Expose notification system globally
  window.addNotification = addNotification
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
/* ============================================
   ENHANCED APP SHELL STYLES
   ============================================ */
:root {
  /* Navbar heights */
  --navbar-height: 90px;
  --navbar-height-scrolled: 70px;

  /* Colors */
  --primary-blue: #1864ab;
  --primary-light: #4dabf7;
  --accent-blue: #339af0;
  --accent-green: #37b24d;
  --text-secondary: #495057;

  /* Background colors */
  --bg-gradient-start: #f8faff;
  --bg-gradient-middle: #f0f7ff;
  --bg-gradient-end: #e6f3ff;
  --bg-pattern-opacity: 0.03;
}

html {
  scroll-behavior: smooth;
  height: 100%;
}

body {
  margin: 0;
  min-height: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg,
      var(--bg-gradient-start) 0%,
      var(--bg-gradient-middle) 50%,
      var(--bg-gradient-end) 100%);
  background-attachment: fixed;
  position: relative;
  overflow-x: hidden;
}

/* Background pattern overlay */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(45deg, var(--primary-blue) 25%, transparent 25%),
    linear-gradient(-45deg, var(--primary-blue) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--primary-blue) 75%),
    linear-gradient(-45deg, transparent 75%, var(--primary-blue) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  opacity: var(--bg-pattern-opacity);
  pointer-events: none;
  z-index: 0;
}

#app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  z-index: 1;
}

/* ============================================
   APP LOADING OVERLAY
   ============================================ */
.app-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: all 0.8s ease;
}

.app-loading-overlay.fade {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.loading-spinner {
  text-align: center;
  color: white;
}

.spinner-ring {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

/* ============================================
   MAIN CONTENT AREA
   ============================================ */
.site-main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--navbar-height));
  margin-top: var(--navbar-height);
  position: relative;
  max-width: 100%;
  overflow-x: hidden;
}

.page-container {
  flex: 1;
  width: 100%;
  position: relative;
  z-index: 2;
  margin: 0 auto;
  padding: 2rem 1rem;
  max-width: 1440px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* ============================================
   PAGE TRANSITIONS
   ============================================ */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* ============================================
   SCROLL TO TOP BUTTON
   ============================================ */
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light) 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 100;
  box-shadow: 0 8px 25px rgba(24, 100, 171, 0.3);
  backdrop-filter: blur(10px);
}

.scroll-to-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.scroll-to-top:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 15px 35px rgba(24, 100, 171, 0.4);
}

.scroll-to-top:active {
  transform: translateY(-2px) scale(1.05);
}

/* ============================================
   ROUTE LOADING INDICATOR
   ============================================ */
.route-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.route-loading.active {
  opacity: 1;
  visibility: visible;
}

.route-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-light), var(--accent-green));
  background-size: 200% 100%;
  animation: progress-slide 1s ease-in-out infinite;
}

@keyframes progress-slide {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

/* ============================================
   NOTIFICATION SYSTEM
   ============================================ */
.notification-container {
  position: fixed;
  top: 100px;
  right: 2rem;
  z-index: 1002;
  max-width: 400px;
  pointer-events: none;
}

.notification-item {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: auto;
  font-weight: 500;
}

.notification-item.success {
  border-left: 4px solid var(--accent-green);
  color: #065f46;
}

.notification-item.error {
  border-left: 4px solid #dc2626;
  color: #7f1d1d;
}

.notification-item.warning {
  border-left: 4px solid #d97706;
  color: #92400e;
}

.notification-item.info {
  border-left: 4px solid var(--primary-blue);
  color: var(--primary-blue);
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  padding: 0.25rem;
  border-radius: 50%;
}

.notification-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.05);
}

/* Notification animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* ============================================
   BACKGROUND EFFECTS
   ============================================ */
.app-background-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(24, 100, 171, 0.1), rgba(73, 171, 247, 0.1));
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: -5%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: -3%;
  animation-delay: 5s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 30%;
  left: 70%;
  animation-delay: 10s;
}

.shape-4 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 20%;
  animation-delay: 15s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.1;
  }

  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.3;
  }
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 991.98px) {
  :root {
    --navbar-height: 80px;
    --navbar-height-scrolled: 60px;
    --bg-pattern-opacity: 0.02;
  }

  .page-container {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 15px;
  }
}

@media (max-width: 576px) {
  :root {
    --navbar-height: 70px;
    --navbar-height-scrolled: 50px;
  }

  .page-container {
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 10px;
  }
}

@media (max-width: 768px) {
  .scroll-to-top {
    bottom: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }

  .notification-container {
    right: 1rem;
    left: 1rem;
    max-width: none;
  }

  .notification-item {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
  }

  .shape {
    opacity: 0.5;
  }

  .shape-1 {
    width: 120px;
    height: 120px;
  }

  .shape-2 {
    width: 100px;
    height: 100px;
  }

  .shape-3 {
    width: 80px;
    height: 80px;
  }

  .shape-4 {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .scroll-to-top {
    width: 45px;
    height: 45px;
    font-size: 0.9rem;
  }

  .notification-item {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
}

/* ============================================
   DARK MODE SUPPORT
   ============================================ */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-gradient-start: #1a2234;
    --bg-gradient-middle: #243654;
    --bg-gradient-end: #2d4568;
    --bg-pattern-opacity: 0.05;
  }

  body {
    background: linear-gradient(135deg, #1a2234 0%, #243654 50%, #2d4568 100%);
  }

  .notification-item {
    background: rgba(44, 62, 80, 0.95);
    color: #e2e8f0;
  }

  .notification-item.success {
    color: #6ee7b7;
  }

  .notification-item.error {
    color: #fca5a5;
  }

  .notification-item.warning {
    color: #fcd34d;
  }

  .notification-item.info {
    color: #93c5fd;
  }

  .page-container {
    background: rgba(44, 62, 80, 0.7);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */
@media (prefers-reduced-motion: reduce) {

  .page-slide-enter-active,
  .page-slide-leave-active,
  .notification-enter-active,
  .notification-leave-active,
  .scroll-to-top,
  .shape,
  .spinner-ring {
    transition: none;
    animation: none;
  }
}

.scroll-to-top:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}
</style>