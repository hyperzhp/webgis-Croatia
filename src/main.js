// src/main.js
import 'leaflet/dist/leaflet.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')