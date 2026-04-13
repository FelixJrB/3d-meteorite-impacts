import { Viewer, Ion } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

/**
 *
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
