import { initViewer } from './cesiumjs/viewer.js'
import { fetchMeteorites } from './api/meteorites.js'
import { addMarkers } from './cesiumjs/markers.js'

const viewer = initViewer()
const data = await fetchMeteorites()
addMarkers(viewer, data)
