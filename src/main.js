// src/main.js
import 'leaflet/dist/leaflet.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Add global styles directly in main.js
const globalStyles = `
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* ============================================
   GLOBAL VARIABLES & RESET
   ============================================ */
:root {
  --primary-blue: #1864ab;
  --primary-light: #4dabf7;
  --accent-blue: #1671c1;
  --accent-purple: #7c3aed;
  --accent-green: #10b981;
  --glass-white: rgba(255, 255, 255, 0.25);
  --glass-dark: rgba(44, 62, 80, 0.85);
  --shadow-light: 0 10px 30px rgba(0,0,0,0.1);
  --shadow-medium: 0 15px 40px rgba(0,0,0,0.15);
  --shadow-heavy: 0 25px 50px rgba(0,0,0,0.2);
  --border-radius-sm: 8px;
  --border-radius-md: 15px;
  --border-radius-lg: 2rem;
  --transition-smooth: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --transition-fast: all 0.2s ease;
}

* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

/* ============================================
   DATASETS PAGE STYLES
   ============================================ */
.datasets-page {
  background: #f0f8ff;
  min-height: 100vh;
  padding: 2rem 0;
}

.dataset-split {
  display: flex;
  flex-wrap: wrap;
  margin: 3rem auto;
  max-width: 1200px;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.dataset-split:hover {
  transform: translateY(-5px);
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.2);
  text-decoration: none;
  color: inherit;
}

.dataset-split.reverse {
  flex-direction: row-reverse;
}

.dataset-text {
  flex: 0 0 60%;
  padding: 2.5rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dataset-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #1864ab;
  transition: color 0.3s ease;
  font-weight: 700;
  line-height: 1.2;
}

.dataset-split:hover .dataset-title {
  color: #0d4f7a;
}

.dataset-desc {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #4a5568;
}

.dataset-info {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dataset-info li {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.dataset-info li strong {
  color: #1864ab;
  font-weight: 600;
}

.dataset-image {
  flex: 0 0 40%;
  min-height: 300px;
  background-color: #f8f9fa;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  position: relative;
}

.dataset-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(24, 100, 171, 0.02) 70%);
  pointer-events: none;
}

/* ============================================
   ENHANCED BUTTONS STYLES
   ============================================ */
.dataset-footer {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 4rem 2rem;
  margin-top: 4rem;
  position: relative;
  overflow: hidden;
}

.dataset-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 20%, rgba(24, 100, 171, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.enhanced-buttons-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.enhanced-btn {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  border-radius: 20px;
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  gap: 1rem;
}

.enhanced-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
  z-index: 1;
}

.enhanced-btn:hover::before {
  left: 100%;
}

.enhanced-btn:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  text-decoration: none;
  color: #fff;
}

.enhanced-btn:active {
  transform: translateY(-4px) scale(1.01);
}

/* Button variants */
.enhanced-btn-primary {
  background: linear-gradient(135deg, #1864ab 0%, #4dabf7 100%);
}

.enhanced-btn-primary:hover {
  background: linear-gradient(135deg, #0d4f7a 0%, #1864ab 100%);
  color: #fff;
}

.enhanced-btn-secondary {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
}

.enhanced-btn-secondary:hover {
  background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%);
  color: #fff;
}

.enhanced-btn-accent {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.enhanced-btn-accent:hover {
  background: linear-gradient(135deg, #047857 0%, #10b981 100%);
  color: #fff;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(5px);
}

.enhanced-btn:hover .btn-icon {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1) rotate(5deg);
}

.btn-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: left;
  position: relative;
  z-index: 2;
}

.btn-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  line-height: 1.2;
}

.btn-subtitle {
  font-size: 0.85rem;
  opacity: 0.85;
  font-weight: 400;
  line-height: 1.3;
}

.btn-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.enhanced-btn:hover .btn-arrow {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(5px);
}

/* Pulse animation for buttons */
@keyframes pulse-btn {
  0%, 100% {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  50% {
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
  }
}

.enhanced-btn:nth-child(1) {
  animation: pulse-btn 4s ease-in-out infinite;
  animation-delay: 0s;
}

.enhanced-btn:nth-child(2) {
  animation: pulse-btn 4s ease-in-out infinite;
  animation-delay: 1.3s;
}

.enhanced-btn:nth-child(3) {
  animation: pulse-btn 4s ease-in-out infinite;
  animation-delay: 2.6s;
}

/* ============================================
   CROATIA BACKGROUND STYLES
   ============================================ */
.croatia-bg {
  background: 
    linear-gradient(rgba(102, 126, 234, 0.85), rgba(118, 75, 162, 0.85)),
    url('https://images.unsplash.com/photo-1555990538-c8d015f2f26a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 80px 0;
}

.croatia-bg-light {
  background: 
    linear-gradient(rgba(255, 255, 255, 0.15), rgba(248, 249, 250, 0.15)),
    url('https://images.unsplash.com/photo-1555990538-c8d015f2f26a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.croatia-bg-subtle {
  background: 
    linear-gradient(rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.95)),
    url('https://images.unsplash.com/photo-1555990538-c8d015f2f26a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 40px 20px;
}

/* ============================================
   GLASSMORPHISM UTILITIES
   ============================================ */
.glass-card {
  background: var(--glass-white);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-medium);
}

.glass-card-dark {
  background: var(--glass-dark);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-medium);
}

.glass-overlay {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* ============================================
   ENHANCED HERO SECTION STYLES
   ============================================ */
.webgis-hero {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 1500px;
  margin: 3rem auto 0 auto;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: var(--shadow-heavy);
  min-height: 600px;
  gap: 0;
  transition: var(--transition-smooth);
  position: relative;
}

.webgis-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(24, 100, 171, 0.02) 70%);
  pointer-events: none;
  z-index: 1;
}

.webgis-hero:hover {
  transform: translateY(-8px);
  box-shadow: 0 35px 70px rgba(0,0,0,0.25);
}

.hero-gallery-section {
  flex: 1.4;
  min-width: 0;
  display: flex;
  align-items: stretch;
  position: relative;
  z-index: 2;
}

.hero-swiper-container {
  width: 100%;
  min-height: 600px;
  background: #1a1a1a;
  display: flex;
  align-items: stretch;
  border-radius: var(--border-radius-lg) 0 0 var(--border-radius-lg);
  overflow: hidden;
  position: relative;
}

.hero-slide-item {
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  overflow: hidden;
}

.hero-slide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  transition: transform 0.6s ease-out;
  filter: brightness(0.9) contrast(1.1);
}

.hero-slide-item:hover .hero-slide-img {
  transform: scale(1.08);
  filter: brightness(1) contrast(1.2);
}

.slide-gradient-overlay {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(24, 100, 171, 0.1) 0%, 
    rgba(0, 0, 0, 0.2) 40%,
    rgba(0, 0, 0, 0.4) 100%);
  z-index: 2;
  transition: opacity 0.3s ease;
}

.hero-slide-item:hover .slide-gradient-overlay {
  opacity: 0.8;
}

.interactive-map-widget {
  position: absolute;
  top: 20px;
  right: 25px;
  z-index: 5;
  width: 75px;
  height: 75px;
  border-radius: 12px;
  border: 2px solid rgba(255,255,255,0.9);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: rgba(255,255,255,0.98);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);
}

.interactive-map-widget:hover {
  transform: scale(1.35) rotate(2deg);
  z-index: 6;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
  border-color: var(--primary-blue);
}

.mini-map-container {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

.map-hover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(24, 100, 171, 0.8), rgba(73, 171, 247, 0.8));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.interactive-map-widget:hover .map-hover-overlay {
  opacity: 1;
}

.map-icon-pin {
  font-size: 1.4rem;
  margin-bottom: 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.location-caption {
  position: absolute;
  left: 2rem;
  bottom: 2.5rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: #fff;
  padding: 1.4rem 1.8rem;
  border-radius: 1.5rem;
  max-width: 420px;
  z-index: 3;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: var(--transition-smooth);
}

.location-caption:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 15px 40px rgba(0,0,0,0.4);
}

.location-caption h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  letter-spacing: 0.3px;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0,0,0,0.4);
  line-height: 1.2;
}

.location-caption p {
  font-size: 1.05rem;
  line-height: 1.5;
  font-weight: 400;
  margin-bottom: 0;
  color: rgba(255,255,255,0.95);
  text-shadow: 0 1px 3px rgba(0,0,0,0.4);
}

.hero-content-section {
  flex: 1;
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-light) 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3.5rem;
  min-height: 600px;
  border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
  position: relative;
  overflow: hidden;
  z-index: 2;
}

.hero-content-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%);
  z-index: 1;
}

.hero-content-inner {
  position: relative;
  z-index: 2;
}

.hero-main-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1.8rem;
  letter-spacing: 0.5px;
  line-height: 1.15;
  background: linear-gradient(45deg, #fff 20%, #e3f2fd 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  line-height: 1.7;
  opacity: 0.96;
  font-weight: 400;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.hero-cta-button {
  display: inline-flex;
  align-items: center;
  background: #fff;
  color: var(--accent-blue);
  font-weight: 700;
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.15rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: var(--transition-smooth);
  border: none;
  position: relative;
  overflow: hidden;
}

.hero-cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.6s;
}

.hero-cta-button:hover::before {
  left: 100%;
}

.hero-cta-button:hover {
  background: var(--primary-blue);
  color: #fff;
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.hero-cta-button:active {
  transform: translateY(-2px);
}

/* ============================================
   SWIPER ENHANCED CUSTOM STYLES
   ============================================ */
.swiper-pagination-bullet {
  background: rgba(255,255,255,0.6) !important;
  opacity: 1 !important;
  width: 14px !important;
  height: 14px !important;
  margin: 0 8px !important;
  transition: all 0.3s ease !important;
  border: 1px solid rgba(255,255,255,0.3) !important;
}

.swiper-pagination-bullet-active {
  background: #fff !important;
  transform: scale(1.4) !important;
  box-shadow: 0 3px 12px rgba(0,0,0,0.4) !important;
  border-color: rgba(255,255,255,0.8) !important;
}

.swiper-button-next,
.swiper-button-prev {
  color: #fff !important;
  background: rgba(255,255,255,0.15) !important;
  backdrop-filter: blur(15px) !important;
  border-radius: 50% !important;
  width: 50px !important;
  height: 50px !important;
  margin-top: -25px !important;
  transition: var(--transition-smooth) !important;
  border: 1px solid rgba(255,255,255,0.3) !important;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  background: rgba(255,255,255,0.25) !important;
  transform: scale(1.15) !important;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
}

.swiper-button-next {
  right: 25px !important;
}

.swiper-button-prev {
  left: 25px !important;
}

/* ============================================
   FEATURES SECTION
   ============================================ */
.features-section {
  padding: 5rem 0;
  background: rgba(255, 255, 255, 0.02);
}

.feature-card {
  text-align: center;
  padding: 3rem 2.5rem;
  height: 100%;
  transition: var(--transition-smooth);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.2);
  background: rgba(255, 255, 255, 0.1);
}

.feature-icon {
  font-size: 4rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, var(--primary-blue), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-card h4 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: #2c3e50;
}

.feature-card p {
  color: #5a6c7d;
  line-height: 1.7;
  font-size: 1.05rem;
}

/* ============================================
   TEAM CARD STYLES
   ============================================ */
.team-card {
  height: 400px;
  perspective: 1000px;
}

.team-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.team-card:hover .team-card-inner {
  transform: rotateY(180deg);
}

.team-card-front,
.team-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  padding: 2rem;
  border-radius: 20px;
}

.team-card-front {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--glass-white);
  backdrop-filter: blur(15px);
}

.team-card-back {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-light));
  color: white;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.team-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.team-card:hover .team-avatar {
  transform: scale(1.05);
}

.team-skills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.team-skill-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.team-social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.team-social-link {
  color: white;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.team-social-link:hover {
  transform: scale(1.2);
}

/* ============================================
   METHODS PAGE STYLES
   ============================================ */
.methods-container {
  position: relative;
}

.methods-nav {
  position: fixed;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  z-index: 10;
}

.methods-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.methods-nav li {
  width: 12px;
  height: 12px;
  margin: 8px 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}

.methods-nav li.active {
  background: var(--primary-blue);
  transform: scale(1.3);
}

.methods-snap {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.step-split {
  display: grid;
  grid-template-columns: minmax(300px, 45%) 1fr;
  scroll-snap-align: start;
  height: 100vh;
  min-height: 600px;
}

.step-split.reverse {
  grid-template-columns: 1fr minmax(300px, 45%);
}

.step-text {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-light));
  color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
}

.step-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.step-desc {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.step-details {
  list-style: none;
  padding: 0;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  line-height: 1.4;
}

.class-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
}

.class-table th,
.class-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
}

.class-table thead {
  background-color: var(--primary-light);
  color: #fff;
}

.class-table tbody tr:nth-child(odd) {
  background-color: rgba(255, 255, 255, 0.3);
}

.legend-container {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.legend-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
}

.step-image {
  background: #f8f9fa;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-panel-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.image-panel-content img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-light);
  transition: transform 0.3s ease;
}

.image-panel-content img:hover {
  transform: scale(1.02);
}

.step-image-placeholder {
  width: 100%;
  height: 100%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.2rem;
}

/* ============================================
   ENHANCED ANIMATIONS
   ============================================ */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-up {
  animation: fadeInUp 0.6s ease-out;
}

.animate-fade-left {
  animation: fadeInLeft 0.6s ease-out;
}

.animate-fade-right {
  animation: fadeInRight 0.6s ease-out;
}

/* ============================================
   RESPONSIVE STYLES
   ============================================ */
@media (min-width: 1200px) {
  .step-split {
    grid-template-columns: minmax(400px, 40%) 1fr;
  }

  .step-split.reverse {
    grid-template-columns: 1fr minmax(400px, 40%);
  }

  .webgis-hero {
    max-width: 95%;
  }
}

@media (max-width: 1024px) {
  .step-split {
    grid-template-columns: minmax(280px, 50%) 1fr;
  }

  .step-split.reverse {
    grid-template-columns: 1fr minmax(280px, 50%);
  }

  .step-text {
    padding: 1.5rem;
  }

  .methods-nav {
    right: 0.5rem;
  }

  .webgis-hero {
    flex-direction: column;
    margin: 2rem auto 0 auto;
    border-radius: 1.5rem;
    max-width: 95%;
  }

  .hero-content-section,
  .hero-swiper-container {
    min-height: 450px;
  }

  .hero-content-section {
    padding: 2.5rem 2rem;
    border-radius: 0 0 1.5rem 1.5rem;
  }

  .hero-swiper-container {
    border-radius: 1.5rem 1.5rem 0 0;
  }

  .interactive-map-widget {
    width: 65px;
    height: 65px;
    top: 15px;
    right: 20px;
  }

  .enhanced-buttons-container {
    flex-direction: column;
    gap: 1.5rem;
  }

  .enhanced-btn {
    min-width: 320px;
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .croatia-bg-light {
    padding: 40px 15px;
  }

  .webgis-hero {
    margin: 1.5rem auto 0 auto;
  }

  .hero-main-title {
    font-size: 2.2rem;
  }

  .hero-description {
    font-size: 1.1rem;
  }

  .location-caption {
    padding: 1.2rem 1.4rem;
    max-width: calc(100% - 2rem);
    left: 1rem;
    right: 1rem;
  }

  .interactive-map-widget {
    width: 55px;
    height: 55px;
    top: 12px;
    right: 15px;
  }

  .hero-cta-button {
    display: block;
    text-align: center;
    margin: 0.5rem 0;
    padding: 1rem 2rem;
  }

  .feature-card {
    padding: 2rem 1.5rem;
  }

  .team-card {
    height: 350px;
  }
  
  .team-card-front,
  .team-card-back {
    padding: 1.5rem;
  }
  
  .team-avatar {
    width: 100px;
    height: 100px;
  }
  
  .croatia-bg {
    padding: 60px 0;
  }

  .step-split,
  .step-split.reverse {
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  .step-text {
    flex: 1;
    padding: 2rem 1.5rem;
    min-height: 60vh;
  }

  .step-image {
    flex: 1;
    min-height: 40vh;
    padding: 1rem;
  }

  .methods-nav {
    display: none;
  }

  .methods-snap {
    scroll-snap-type: none;
  }

  .dataset-split {
    flex-direction: column;
    margin: 2rem auto;
  }

  .dataset-split.reverse {
    flex-direction: column;
  }

  .dataset-text {
    flex: none;
    padding: 2rem 1.5rem;
  }

  .dataset-image {
    flex: none;
    height: 250px;
    min-height: 250px;
  }

  .dataset-footer {
    padding: 3rem 1.5rem;
  }

  .enhanced-btn {
    min-width: 280px;
    padding: 1.2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-content-section {
    padding: 2rem 1.5rem;
  }

  .hero-main-title {
    font-size: 1.9rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .features-section {
    padding: 3rem 0;
  }

  .step-text {
    padding: 1.5rem 1rem;
  }

  .step-image {
    padding: 0.5rem;
    min-height: 30vh;
  }

  .class-table {
    font-size: 0.7rem;
  }

  .class-table th,
  .class-table td {
    padding: 0.3rem;
  }

  .interactive-map-widget {
    width: 50px;
    height: 50px;
    top: 10px;
    right: 12px;
  }

  .dataset-text {
    padding: 1.5rem 1rem;
  }

  .dataset-title {
    font-size: 1.6rem;
  }

  .dataset-desc {
    font-size: 1rem;
  }

  .dataset-footer {
    padding: 2.5rem 1rem;
  }

  .enhanced-btn {
    min-width: 100%;
    padding: 1rem 1.2rem;
    gap: 0.8rem;
  }

  .btn-title {
    font-size: 1rem;
  }

  .btn-subtitle {
    font-size: 0.8rem;
  }

  .btn-icon {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
}

/* Print styles */
@media print {
  .methods-nav {
    display: none;
  }

  .step-split {
    height: auto;
    page-break-inside: avoid;
    margin-bottom: 2rem;
  }
}

/* ============================================
   UTILITY CLASSES
   ============================================ */
.text-gradient {
  background: linear-gradient(45deg, var(--primary-blue), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-primary-gradient {
  background: linear-gradient(45deg, var(--primary-blue), var(--primary-light));
  border: none;
  color: white;
  transition: var(--transition-smooth);
}

.btn-primary-gradient:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.container-fluid-custom {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-padding {
  padding: 4rem 0;
}

.section-padding-lg {
  padding: 6rem 0;
}
`

// Inject styles into the page
const styleSheet = document.createElement('style')
styleSheet.textContent = globalStyles
document.head.appendChild(styleSheet)

createApp(App).use(router).mount('#app')