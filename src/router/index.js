import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/webgis', name: 'webgis', component: () => import('@/views/MapView.vue') },
  { path: '/methods', name: 'methods', component: () => import('@/views/MethodsView.vue') },
  { path: '/results', name: 'results', component: () => import('@/views/ResultsView.vue') },
  { path: '/team', name: 'team', component: () => import('@/views/TeamView.vue') },
  { path: '/dataset', name: 'dataset', component: () => import('@/views/DatasetView.vue') },
  { path: '/:catchAll(.*)', redirect: '/' }
]

export default createRouter({
  history: createWebHistory('/'),  // Changed this line
  routes
})