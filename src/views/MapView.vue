<template>
  <div class="map-view">
    <map-container></map-container>
  </div>
</template>

<script>
import MapContainer from '@/components/map/MapContainer.vue';

export default {
  name: 'MapView',
  components: {
    MapContainer
  }
};
</script>

<style scoped>
.map-view {
  height: 100vh;
  width: 100%;
}
</style>