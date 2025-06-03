<template>
  <div id="app-shell">
    <NavBar />
    <main class="site-main">
      <router-view />
    </main>
    <FooterBar />
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
  background: linear-gradient(135deg, #e6f5fd 60%, #c8e0f8 100%);
  min-height: 100vh;
}

#app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Optional: subtle dark mode body */
@media (prefers-color-scheme: dark) {
  body {
    background: linear-gradient(135deg, #1a2234 60%, #243654 100%);
  }
}
</style>
