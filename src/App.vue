<template>
  <NavBar />
  <router-view />
  <FooterBar />
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'
</script>

<style>
/* site-wide background & font */
body {
  margin: 0;
  background: #e6f5fd;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
}
</style>
