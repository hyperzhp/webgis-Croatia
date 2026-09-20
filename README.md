# Croatia Air-Quality WebGIS

An interactive WebGIS for exploring air-quality trends, land cover, and population exposure across Croatia. The project turns a multi-source geospatial workflow into a browser-based interface where users can compare annual pollutant maps, inspect 2022 anomalies, and identify places where high concentrations overlap with dense population.

Built as a group project by MSc Geoinformatics Engineering students at [Politecnico di Milano](https://www.polimi.it/).

## What the application provides

- Interactive Croatia map with satellite and OpenStreetMap basemaps.
- Toggleable GeoServer WMS layers for NO₂, PM₂.₅, and PM₁₀.
- Annual concentration maps for 2013–2022 with a year slider.
- Difference maps comparing 2022 with the 2017–2021 mean.
- Bivariate population-exposure maps for 2020, combining pollution classes with WorldPop population quantiles.
- A methods page documenting the raster-processing and spatial-analysis workflow.
- Results pages with pollutant time series and population-exposure charts.
- Dataset documentation for CAMS, ESA CCI Land Cover, WorldPop, and FAO GAUL boundaries.

## Data and analysis workflow

The analysis combines the following sources:

| Source | Role in the project |
| --- | --- |
| [CAMS Air-Quality Reanalysis](https://ads.atmosphere.copernicus.eu/cdsapp#!/dataset/cams-europe-air-quality-reanalyses) | Monthly pollutant rasters for NO₂, PM₂.₅, and PM₁₀ from 2013–2022 |
| [ESA CCI Land Cover](https://cds.climate.copernicus.eu/cdsapp#!/dataset/satellite-land-cover) | 2022 land-cover classification used to compare pollution across land-cover types |
| [WorldPop](https://hub.worldpop.org/geodata/summary?id=24777) | High-resolution population counts for 2020 |
| [FAO GAUL](https://data.apps.fao.org/map/catalog/srv/eng/catalog.search#/metadata/9c35ba10-5649-41c8-bdfc-eb78e9e65654) | Croatia administrative boundary used for clipping and spatial analysis |

The processing pipeline is:

1. Clip monthly CAMS rasters to the Croatia boundary and aggregate 12 months into annual means.
2. Reclassify annual concentrations into five pollutant classes using the project thresholds.
3. Calculate 2022 minus the 2017–2021 mean to produce annual-average-difference maps.
4. Reclassify the 2022 ESA CCI land-cover raster into broad analysis classes.
5. Use zonal statistics to summarize pollutant values across land-cover and urban zones.
6. Clip and quantile-classify the 2020 WorldPop raster.
7. Combine pollutant and population classes into 5×5 bivariate exposure layers.
8. Publish the processed layers through GeoServer and consume them as WMS layers in the Vue application.

## Technology stack

- **Frontend:** Vue 3, Vue Router, Bootstrap 5, Swiper
- **Mapping:** OpenLayers, Leaflet, OpenStreetMap, ArcGIS World Imagery
- **Geospatial services:** GeoServer WMS
- **Analysis:** QGIS raster calculator, reclassification, zonal statistics, and quantile classification
- **Data access and utilities:** Axios, Turf.js

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Project overview and Croatia highlights |
| `/webgis` | Interactive map and layer controls |
| `/dataset` | Dataset descriptions and source links |
| `/methods` | Reproducible analysis workflow |
| `/results` | Time-series and exposure results |
| `/team` | Project contributors |

## Run locally

Requirements: Node.js 18 or later and npm.

```bash
git clone https://github.com/hyperzhp/webgis-Croatia.git
cd webgis-Croatia
npm install
npm run serve
```

The development server will print a local URL, usually `http://localhost:8080`.

Create a production build with:

```bash
npm run build
```

Run the configured linter with:

```bash
npm run lint
```

## GeoServer configuration

The map currently reads WMS layers from the project GeoServer workspace and expects the layer names used in [`src/views/MapView.vue`](src/views/MapView.vue). If you deploy your own GeoServer instance, update the WMS endpoint and layer names in that file, then rebuild the application.

The interactive map also depends on the availability of the remote WMS service. The analysis pages and local assets remain useful when that service is unavailable, but the live thematic layers will not render until the endpoint is reachable.

## Project structure

```text
src/
├── components/       Shared navigation and footer components
├── services/         Geospatial service helpers
├── views/            Home, map, datasets, methods, results, and team pages
├── styles/           Page-level stylesheets
└── assets/           Maps, charts, legends, and project imagery
```

## Contributors

- [Haipeng Zhu](https://github.com/hyperzhp) — frontend framework, responsive UI, and project integration
- [Rohollah Naeijian](https://github.com/rohollah-naeijian) — geospatial analysis and data preparation
- [Evgenii Miasnikov](https://github.com/EVMiasnikov) — interactive mapping, layer controls, and GeoServer integration

## Scope and data note

This repository contains the web client and the visual materials used to present the analysis. The underlying CAMS, ESA CCI, WorldPop, and GAUL datasets are provided by their respective organisations and remain subject to their terms of use. The maps are intended for exploratory and educational analysis; they should not be treated as an official regulatory air-quality assessment.
