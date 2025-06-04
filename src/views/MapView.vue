<template>
  <div id="map_and_legend_container">

    <!-- Time slider -->
    <div v-if="isNO2YearlyVisible" class="time-slider">
      <label for="year">Year:</label>
      <input type="range" id="year" min="2013" max="2022" v-model="selectedYear" @input="updateYear" />
      <span>{{ selectedYear }}</span>
    </div>

    <!-- Info panel with animation -->
    <Transition name="slide-fade" mode="out-in">
      <div v-if="activeLayerInfo && showInfoPanel" class="info-panel" :key="activeLayerInfo.title">
        <div class="info-panel-header">
          <h3>{{ activeLayerInfo.title }}</h3>
          <button @click="hideInfoPanel" class="close-btn" title="Hide panel">×</button>
        </div>
        <div class="info-panel-content">
          <p><strong>Description:</strong> {{ activeLayerInfo.description }}</p>
          <p><strong>Data source:</strong> {{ activeLayerInfo.source }}</p>
          <p><strong>Year:</strong> {{ activeLayerInfo.year }}</p>

          <!-- Show image if present -->
          <div v-if="activeLayerInfo.image" class="layer-image">
            <img :src="activeLayerInfo.image" :alt="activeLayerInfo.title" />
          </div>

          <div v-if="activeLayerInfo.legend" class="legend-info">
            <strong>Legend:</strong>
            <!-- Check if legend is a string (image path) -->
            <div v-if="typeof activeLayerInfo.legend === 'string'" class="legend-image">
              <img :src="activeLayerInfo.legend" :alt="activeLayerInfo.title + ' legend'" />
            </div>
            <!-- Otherwise render color blocks -->
            <div v-else class="legend-colors">
              <div v-for="item in activeLayerInfo.legend" :key="item.label" class="legend-item-info">
                <span class="legend-color-box" :style="{ backgroundColor: item.color }"></span>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div id="map"></div>
    <div class="legend">
      <!-- Legend with groups -->
      <div v-for="group in layerGroups" :key="group.get('title')" class="legend-group">
        <div class="legend-group-header">
          <!-- Expand/collapse button for all groups -->
          <button @click="toggleGroupExpansion(group)" class="expand-collapse-btn">
            <span v-if="isGroupExpanded(group)">▼</span>
            <span v-else>▶</span>
          </button>
          <strong>{{ group.get('title') }}</strong>
        </div>

        <div class="legend-group-layers" v-if="group.getVisible() && isGroupExpanded(group)">
          <div v-for="layer in group.getLayers().getArray()" :key="layer.get('title')" class="legend-item">
            <!-- Radio buttons for base layers -->
            <label v-if="group.get('title') === 'Base Layers'">
              <input type="radio" name="baseLayer" :checked="layer.getVisible()" @change="selectBaseLayer(layer)" />
              {{ layer.get('title') }}
            </label>

            <!-- Radio buttons for thematic layers (all other groups) -->
            <label v-else>
              <input type="radio" name="thematicLayer" :checked="layer.getVisible()"
                @change="selectThematicLayer(layer)" />
              {{ layer.get('title') }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import { fromLonLat } from 'ol/proj';
import pm10UrbanChart from '@/assets/pm10-urban-chart.png';
import bivariateLegend from '@/assets/legend.png';

// Reactive variables for the information panel
const activeLayerInfo = ref(null);
const showInfoPanel = ref(false);

// Reactive variables for managing group expansion
const expandedGroups = ref(new Set(['Base Layers'])); // "Base Layers" is expanded by default

const layerInfoData = {
  'Population exposure to NO₂ 2020': {
    title: 'Population Exposure to NO₂ (2020)',
    description: 'The bivariate map shows the relationship between nitrogen dioxide concentration and population distribution in Croatia for the year 2020.',
    source: 'GIS GeoServer - Politecnico di Milano',
    year: '2020',
    legend: bivariateLegend
  },
  'Population exposure to PM10 2020': {
    title: 'Population Exposure to PM10 (2020)',
    description: 'The bivariate map shows the relationship between PM10 particle concentration and population distribution in Croatia for the year 2020.',
    source: 'GIS GeoServer - Politecnico di Milano',
    year: '2020',
    legend: bivariateLegend
  },
  'NO₂ yearly map': {
    title: 'Annual Mean NO₂ Concentration Map',
    description: 'Map showing the distribution of annual mean nitrogen dioxide concentration across Croatia with a selectable year range from 2013 to 2022.',
    source: 'GIS GeoServer - Politecnico di Milano',
    year: 'Variable (2013–2022)',
    legend: [
      { color: '#e8f4fd', label: 'Level 1: ≤ 10 µg/m³' },
      { color: '#b3d9f7', label: 'Level 2: >10 and ≤ 25 µg/m³' },
      { color: '#ffcc80', label: 'Level 3: >25 and ≤ 40 µg/m³' },
      { color: '#ff8a65', label: 'Level 4: >40 and ≤ 50 µg/m³' },
      { color: '#d32f2f', label: 'Level 5: >50 µg/m³' }
    ]
  },
  'PM 10 yearly map': {
    title: 'Annual Mean PM10 Concentration Map',
    description: 'Map showing the distribution of annual mean PM10 particle concentration across Croatia with a selectable year range from 2013 to 2022.',
    source: 'GIS GeoServer - Politecnico di Milano',
    year: 'Variable (2013–2022)',
    legend: [
      { color: '#e8f4fd', label: 'Level 1: ≤ 15 µg/m³' },
      { color: '#b3d9f7', label: 'Level 2: >15 and ≤ 31 µg/m³' },
      { color: '#ffcc80', label: 'Level 3: >31 and ≤ 40 µg/m³' },
      { color: '#ff8a65', label: 'Level 4: >40 and ≤ 50 µg/m³' },
      { color: '#d32f2f', label: 'Level 5: >50 µg/m³' }
    ]
  },
  'PM 2.5 yearly map': {
    title: 'Annual Mean PM2.5 Concentration Map',
    description: 'Map showing the distribution of annual mean PM2.5 particle concentration across Croatia with a selectable year range from 2013 to 2022.',
    source: 'GIS GeoServer - Politecnico di Milano',
    year: 'Variable (2013–2022)',
    legend: [
      { color: '#e8f4fd', label: 'Level 1: ≤ 5 µg/m³' },
      { color: '#b3d9f7', label: 'Level 2: >5 and ≤ 10 µg/m³' },
      { color: '#ffcc80', label: 'Level 3: >10 and ≤ 20 µg/m³' },
      { color: '#ff8a65', label: 'Level 4: >20 and ≤ 25 µg/m³' },
      { color: '#d32f2f', label: 'Level 5: >25 µg/m³' }
    ]
  },
  '2022 and 2017-2021 mean concentration of PM2.5': {
    title: 'Difference in Annual Mean PM2.5 Concentration (2022 vs 2017–2021)',
    description: 'Difference between PM2.5 concentration in 2022 and the mean concentration during 2017–2021 in Croatia.',
    source: 'GIS GeoServer - Politecnico di Milano',
    year: '2022',
    legend: [
      { color: '#2166ac', label: '≤ -3 µg/m³' },
      { color: '#92c5de', label: '-3 – -1.5 µg/m³' },
      { color: '#f7f7f7', label: '-1.5 – 0 µg/m³' },
      { color: '#fdbf6f', label: '0 – 1.5 µg/m³' },
      { color: '#e08214', label: '1.5 – 3 µg/m³' },
      { color: '#b2182b', label: '> 3 µg/m³' }
    ]
  },
  '2022 and 2017-2021 mean concentration of NO₂': {
    title: 'Difference in Annual Mean NO₂ Concentration (2022 vs 2017–2021)',
    description: 'Difference between nitrogen dioxide concentration in 2022 and the mean concentration during 2017–2021 in Croatia.',
    source: 'GIS GeoServer - Politecnico di Milano',
    year: '2022',
    legend: [
      { color: '#2166ac', label: '≤ -5 µg/m³' },
      { color: '#92c5de', label: '-5 – -2 µg/m³' },
      { color: '#f7f7f7', label: '-2 – 0 µg/m³' },
      { color: '#fdbf6f', label: '0 – 2 µg/m³' },
      { color: '#e08214', label: '2 – 5 µg/m³' },
      { color: '#b2182b', label: '> 5 µg/m³' }
    ]
  },
  '2022 and 2017-2021 mean concentration of PM10': {
    title: 'Difference in Annual Mean PM10 Concentration (2022 vs 2017–2021)',
    description: 'Difference between PM10 particle concentration in 2022 and the mean concentration during 2017–2021 in Croatia.',
    source: 'GIS GeoServer - Politecnico di Milano',
    year: '2022',
    legend: [
      { color: '#2166ac', label: '≤ -10 µg/m³' },
      { color: '#92c5de', label: '-10 – -4 µg/m³' },
      { color: '#f7f7f7', label: '-4 – 0 µg/m³' },
      { color: '#fdbf6f', label: '0 – 4 µg/m³' },
      { color: '#e08214', label: '4 – 10 µg/m³' },
      { color: '#b2182b', label: '> 10 µg/m³' }
    ]
  },
  'Urban zones 2022': {
    title: 'PM10 Concentration in Urban Zones',
    description: 'Time series showing mean and maximum PM10 concentrations in Croatian urban zones from 2013 to 2022. The chart displays pollution trends in densely populated areas.',
    source: 'GIS GeoServer - Politecnico di Milano',
    year: '2013–2022',
    image: pm10UrbanChart,
    legend: [
      { color: '#AAAAAA', label: 'Urban Zones' },
    ]
  },
};

// Функция для показа информации о слое
function showLayerInfo(layerTitle) {
  if (layerInfoData[layerTitle]) {
    // Если панель уже показана, сначала скрываем её
    if (showInfoPanel.value) {
      showInfoPanel.value = false;
      setTimeout(() => {
        activeLayerInfo.value = layerInfoData[layerTitle];
        showInfoPanel.value = true;
      }, 300);
    } else {
      // Если панель скрыта, просто показываем
      activeLayerInfo.value = layerInfoData[layerTitle];
      showInfoPanel.value = true;
    }
  }
}

// Функция для скрытия информационной панели
function hideInfoPanel() {
  showInfoPanel.value = false;
  setTimeout(() => {
    activeLayerInfo.value = null;
  }, 300); // Задержка для завершения анимации
}

// Функции для управления раскрытием групп
function toggleGroupExpansion(group) {
  const groupTitle = group.get('title');
  if (expandedGroups.value.has(groupTitle)) {
    expandedGroups.value.delete(groupTitle);
  } else {
    expandedGroups.value.add(groupTitle);
  }
  // Принудительно обновляем реактивность
  expandedGroups.value = new Set(expandedGroups.value);
}

function isGroupExpanded(group) {
  return expandedGroups.value.has(group.get('title'));
}

// Базовые слои
const baseLayer = new TileLayer({
  source: new OSM(),
  title: 'OpenStreetMap',
  visible: false,
});
baseLayer.set('color', '#1f78b4');

const satelliteLayer = new TileLayer({
  source: new XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  }),
  title: 'Satellite Imagery',
  visible: true,
});
satelliteLayer.set('color', '#33a02c');

// Тематические слои

const BivariateLayerNO2 = new TileLayer({
  source: new TileWMS({
    url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wms',
    params: {
      LAYERS: 'gisgeoserver_04:Croatia_no2_2020_bivariate',
      TILED: true,
      FORMAT: 'image/png',
      TRANSPARENT: true,
    },
    serverType: 'geoserver',
  }),
  title: 'Population exposure to NO₂ 2020',
  visible: false,
});
const BivariateLayerPM10 = new TileLayer({
  source: new TileWMS({
    url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wms',
    params: {
      LAYERS: 'gisgeoserver_04:Croatia_pm10_2020_bivariate',
      TILED: true,
      FORMAT: 'image/png',
      TRANSPARENT: true,
    },
    serverType: 'geoserver',
  }),
  title: 'Population exposure to PM10 2020',
  visible: true,
});
const AADPM10 = new TileLayer({
  source: new TileWMS({
    url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wms',
    params: {
      LAYERS: 'gisgeoserver_04:Croatia_pm10_2017-2021_AAD_map_2022',
      TILED: true,
      FORMAT: 'image/png',
      TRANSPARENT: true,
    },
    serverType: 'geoserver',
  }),
  title: '2022 and 2017-2021 mean concentration of PM10',
  visible: false,
});
const AADPM2p5 = new TileLayer({
  source: new TileWMS({
    url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wms',
    params: {
      LAYERS: 'gisgeoserver_04:Croatia_pm2p5_2017-2021_AAD_map_2022',
      TILED: true,
      FORMAT: 'image/png',
      TRANSPARENT: true,
    },
    serverType: 'geoserver',
  }),
  title: '2022 and 2017-2021 mean concentration of PM2.5',
  visible: false,
});
const AADNO2 = new TileLayer({
  source: new TileWMS({
    url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wms',
    params: {
      LAYERS: 'gisgeoserver_04:Croatia_no2 _2017-2021_AAD_map _2022',
      TILED: true,
      FORMAT: 'image/png',
      TRANSPARENT: true,
    },
    serverType: 'geoserver',
  }),
  title: '2022 and 2017-2021 mean concentration of NO₂',
  visible: false,
});

const UrbanLayer = new TileLayer({
  source: new TileWMS({
    url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wms',
    params: {
      LAYERS: 'Urban_pollution_yearly_max_mean',
      TILED: true,
      FORMAT: 'image/png',
      TRANSPARENT: true,
    },
    serverType: 'geoserver',
  }),
  title: 'Urban zones 2022',
  visible: false,
});

const selectedYear = ref(2022);

// Добавляем реактивную переменную для отслеживания видимости timelapse слоев
const isNO2YearlyVisible = ref(false); // изначально false, так как слой создается с visible: false

const NO2yearlyMapLayer = new TileLayer({
  source: new TileWMS({
    url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wms',
    params: {
      LAYERS: `gisgeoserver_04:Croatia_no2_concentration_map_${selectedYear.value}`,
      TILED: true,
      FORMAT: 'image/png',
      TRANSPARENT: true,
    },
    serverType: 'geoserver',
  }),
  title: 'NO₂ yearly map',
  visible: false,
});
const PM10yearlyMapLayer = new TileLayer({
  source: new TileWMS({
    url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wms',
    params: {
      LAYERS: `gisgeoserver_04:Croatia_concentration_map_pm10_${selectedYear.value}`,
      TILED: true,
      FORMAT: 'image/png',
      TRANSPARENT: true,
    },
    serverType: 'geoserver',
  }),
  title: 'PM 10 yearly map',
  visible: false,
});
const PM2p5yearlyMapLayer = new TileLayer({
  source: new TileWMS({
    url: 'https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_04/wms',
    params: {
      LAYERS: `gisgeoserver_04:Croatia_pm2p5_concentration_map_${selectedYear.value}`,
      TILED: true,
      FORMAT: 'image/png',
      TRANSPARENT: true,
    },
    serverType: 'geoserver',
  }),
  title: 'PM 2.5 yearly map',
  visible: false,
});

function updateYear() {

  NO2yearlyMapLayer.getSource().updateParams({
    LAYERS: `gisgeoserver_04:Croatia_no2_concentration_map_${selectedYear.value}`,
  });

  PM10yearlyMapLayer.getSource().updateParams({
    LAYERS: `gisgeoserver_04:Croatia_concentration_map_pm10_${selectedYear.value}`,
  });

  PM2p5yearlyMapLayer.getSource().updateParams({
    LAYERS: `gisgeoserver_04:Croatia_pm2p5_concentration_map_${selectedYear.value}`,
  });
}


// Создаем группы слоев
const baseGroup = new LayerGroup({
  layers: [
    baseLayer,
    satelliteLayer
  ],
  title: 'Base Layers',
  visible: true,
});

const bivariateGroup = new LayerGroup({
  layers: [
    BivariateLayerNO2,
    BivariateLayerPM10
  ],
  title: 'Population exposure to pollutants',
  visible: true,
});

const YearlyConcentrationMapsGroup = new LayerGroup({
  layers: [
    NO2yearlyMapLayer,
    PM10yearlyMapLayer,
    PM2p5yearlyMapLayer
  ],
  title: 'Yearly concentration maps',
  visible: true,
});

const AADGroup = new LayerGroup({
  layers: [
    AADPM10,
    AADPM2p5,
    AADNO2
  ],
  title: 'Annual difference in average concentration from 5 year mean',
  visible: true,
});

const OtherGroup = new LayerGroup({
  layers: [
    UrbanLayer,
  ],
  title: 'Other',
  visible: true,
});

// Массив групп для легенды
const layerGroups = ref([
  baseGroup,
  bivariateGroup,
  YearlyConcentrationMapsGroup,
  AADGroup,
  OtherGroup
]);

let map = null;

// Геодезические координаты границ Хорватии (долгота, широта)
const croatiaGeodeticBounds = {
  west: 8.0, // Западная граница (долгота)
  south: 42,   // Южная граница (широта)
  east: 24.0,    // Восточная граница (долгота)  
  north: 47.5,    // Северная граница (широта)
};

// Конвертация каждой точки в Web Mercator
const southWest = fromLonLat([croatiaGeodeticBounds.west, croatiaGeodeticBounds.south]);
const northEast = fromLonLat([croatiaGeodeticBounds.east, croatiaGeodeticBounds.north]);

// Создание extent в Web Mercator [minX, minY, maxX, maxY]
const croatiaExtentFromCoords = [
  southWest[0],  // minX (западная граница)
  southWest[1],  // minY (южная граница)
  northEast[0],  // maxX (восточная граница)
  northEast[1]   // maxY (северная граница)
];

// Центр Хорватии в Web Mercator
const croatiaCenterGeod = [15.919098992526344, 45.10343711219004];

const croatiaCenter = fromLonLat(croatiaCenterGeod); // Конвертация в Web Mercator

onMounted(() => {
  map = new Map({
    target: 'map',
    layers: [
      baseGroup,
      bivariateGroup,
      YearlyConcentrationMapsGroup,
      AADGroup,
      OtherGroup
    ],
    view: new View({
      center: croatiaCenter,
      zoom: 7,
      minZoom: 7,
      maxZoom: 12,
      extent: croatiaExtentFromCoords,
      constrainOnlyCenter: false,
      enableRotation: false
    }),
  });

  // 显示活动图层信息
  showLayerInfo('Population exposure to PM10 2020');
  console.log('地图和图层组已初始化', map);
});

onUnmounted(() => {
  // 清理地图实例
  if (map) {
    map.setTarget(null);
    map = null;
  }
  // 恢复滚动
  document.body.style.overflow = '';
});

// Функция для выбора базового слоя
function selectBaseLayer(selectedLayer) {
  // Сначала скрываем все базовые слои
  baseGroup.getLayers().getArray().forEach(layer => {
    layer.setVisible(false);
  });

  // Затем показываем только выбранный слой
  selectedLayer.setVisible(true);

  // Принудительно обновляем карту (если нужно)
  map?.render();
}

// Функция для выбора тематического слоя
function selectThematicLayer(selectedLayer) {
  // Скрываем все тематические слои из всех групп (кроме базовых)
  layerGroups.value.forEach(group => {
    if (group.get('title') !== 'Base Layers') {
      group.getLayers().getArray().forEach(layer => {
        layer.setVisible(false);
      });
    }
  });

  // Показываем только выбранный слой
  selectedLayer.setVisible(true);

  // Обновляем состояние временного слайдера
  isNO2YearlyVisible.value = checkIfAnyTimeLayerVisible();

  // Показываем информацию о выбранном слое
  showLayerInfo(selectedLayer.get('title'));

  map?.render();
}

function checkIfAnyTimeLayerVisible() {
  return (
    // NO2yearlyLayer.getVisible() ||
    NO2yearlyMapLayer.getVisible() ||
    PM10yearlyMapLayer.getVisible() ||
    PM2p5yearlyMapLayer.getVisible()
  );
}
</script>

<style>
/* Базовые стили */
#map_and_legend_container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

#map {
  width: 100%;
  height: 100%;
  position: relative;
  background: rgba(20, 255, 255, 0.95);
}

/* Стили для легенды с группами */
.legend {
  position: absolute;
  top: 74px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  padding: 7px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 320px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 85vh;
  overflow-y: auto;
}

/* Chrome, Edge, Safari */
.legend::-webkit-scrollbar {
  width: 8px;
}

.legend::-webkit-scrollbar-track {
  background: transparent;
}

.legend::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 4px;
}

/* Firefox */
.legend {
  scrollbar-width: thin;
  scrollbar-color: #bbb transparent;
}

.legend-group {
  margin-bottom: 7px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 5px;
  background: rgba(248, 249, 250, 0.5);
}

.legend-group:last-child {
  margin-bottom: 0;
}

.legend-group-header {
  margin-bottom: 1px;
  padding-bottom: 5px;
  border-bottom: 1px solid #dee2e6;
}

.legend-group-header label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  color: #495057;
}

.legend-group-header input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.1);
}

.legend-group-layers {
  padding-left: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  padding: 2px 0;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #6c757d;
}

.legend-item input[type="checkbox"] {
  margin-right: 8px;
}

.legend-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.legend-colors {
  margin-top: 10px;
}

.legend-item-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
}

.legend-item-info:last-child {
  margin-bottom: 0;
}

.legend-color-box {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 10px;
  border: 1px solid #333;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-colors strong {
  color: #495057;
  font-weight: 600;
}

/* Стили для элементов управления картой */
.ol-zoom {
  top: auto;
  bottom: 10px;
  left: 10px;
  right: auto;
}

.ol-attribution {
  top: auto;
  bottom: 60px;
  left: auto;
  right: 10px;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  max-width: 200px;
}

.ol-zoom .ol-zoom-in,
.ol-zoom .ol-zoom-out {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  width: 32px;
  height: 32px;
}

.ol-zoom .ol-zoom-in:hover,
.ol-zoom .ol-zoom-out:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.time-slider {
  position: absolute;
  bottom: 20px;
  /* Размещаем внизу карты */
  left: 50%;
  /* Позиционируем по центру */
  transform: translateX(-50%);
  /* Центрируем относительно левого края */
  z-index: 1500;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 20px;
  border-radius: 25px;
  /* Более округлая форма */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  /* Центрируем содержимое */
  gap: 12px;
  /* Расстояние между элементами */
  min-width: 280px;
  /* Минимальная ширина для лучшего вида */
}

.time-slider label {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  white-space: nowrap;
}

.time-slider input[type="range"] {
  width: 180px;
  height: 6px;
  border-radius: 3px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
  vertical-align: middle;
  /* Выравнивание по вертикали */
  margin: 0;
  /* Убираем внешние отступы */
}

.time-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.time-slider input[type="range"]::-webkit-slider-thumb:hover {
  background: #5a67d8;
  transform: scale(1.1);
}

.time-slider input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.time-slider span {
  font-weight: 700;
  color: #667eea;
  font-size: 16px;
  min-width: 40px;
  text-align: center;
  line-height: 1;
  /* Убираем лишнюю высоту строки */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Стили для информационной панели */
.info-panel {
  position: absolute;
  top: 74px;
  left: 10px;
  width: 400px;
  max-height: 80vh;
  /* Was 60vh */
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1500;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.info-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #f9f9f9;
  color: #333;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e0e0e0;
}

.info-panel-header h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 500;
  color: #222;
}

.close-btn {
  background: #e8e8e8;
  border: none;
  color: #555;
  font-size: 20px;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.close-btn:hover {
  background: #d0d0d0;
  transform: rotate(90deg);
}

.info-panel-content {
  padding: 20px;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
  overflow-x: clip;
}

.info-panel-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

/* Анимация выезжания панели */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.slide-fade-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.expand-collapse-btn {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  margin-right: 8px;
  padding: 0;
  color: #495057;
  transition: transform 0.2s ease;
}

.expand-collapse-btn:hover {
  transform: scale(1.1);
}

.legend-group-header {
  margin-bottom: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
}

.legend-item input[type="radio"] {
  margin-right: 8px;
}

.legend-image {
  margin-top: 10px;
  text-align: center;
}

.legend-image img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.layer-image img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}
</style>