# 3D Earth Meteorite Impacts

An interactive 3D globe visualizing ~45,000 meteorite impact sites from NASA's Meteorite Landings dataset. Filter by mass, year, and location — click any marker to see reverse-geocoded location data.

## Technologies used:
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![CesiumJS](https://img.shields.io/badge/CesiumJS-6CADDF?logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

## Live demo

> Link coming soon (deploying on Render)


## Pictures
![Globe showing meteorite impacts worldwide](image-1.png)
![Europe markers with clusters](image.png)
![Billboard with information about the meteorite](image-2.png)

## Features

- 3D globe with color-coded markers by meteorite mass
- Dynamic clustering based on zoom level
- Filter by mass category, year range, and location name
- Reverse geocoding on marker click via Nominatim (OpenStreetMap)
- Resizable and toggleable sidebar
- Falls back to local backup if NASA API is unavailable

## Tech stack

| Layer | Technology |
|---|---|
| 3D Globe | [CesiumJS](https://cesium.com/) |
| Runtime | Node.js |
| Language | JavaScript (ES modules) |
| Frontend bundler | [Vite](https://vitejs.dev/) |
| Backend | [Express](https://expressjs.com/) |
| UI | [Bootstrap 5](https://getbootstrap.com/) |
| Geocoding | [Nominatim](https://nominatim.org/) (OpenStreetMap) |
| Testing | [Vitest](https://vitest.dev/) |
| Containerization | Docker |
| Web server | Caddy |
| Data | [NASA Meteorite Landings API](https://data.nasa.gov/resource/gh4g-9sfh.json) |

## Getting started

```bash
git clone https://github.com/FelixJrB/3d-meteorite-impacts.git
cd 3d-meteorite-impacts
npm install
```

Create a `.env` file in the project root:

```
VITE_CESIUM_TOKEN=your_cesium_ion_token
```

```bash
npm run dev      # start development server
npm test         # run unit tests
npm run build    # production build
```

## Folder structure

```
3D-meteorite-impacts/
├── index.html
├── server.js
└── src/
    ├── main.js
    ├── api/
    │   ├── meteorites.js
    │   └── nominatim.js
    ├── cesiumjs/
    │   ├── markers.js
    │   └── viewer.js
    ├── styles/
    │   └── cesiumContainer.css
    └── utils/
        └── filterMeteorites.js
```