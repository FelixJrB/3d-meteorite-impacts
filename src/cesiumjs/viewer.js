import { Viewer, Ion } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

/**
 * Initializes the Cesium viewer with custom options and returns the viewer instance.
 *
 * @returns {Viewer} - The initialized Cesium viewer instance.
 */
export function initViewer() {
  Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN

  const viewer = new Viewer('cesiumContainer', {
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    
  })
  viewer.cesiumWidget.creditContainer.style.display = 'none'

  return viewer
}
