import { initViewer } from './cesiumjs/viewer.js'
import { fetchMeteorites } from './api/meteorites.js'
import { addMarkers } from './cesiumjs/markers.js'
import './styles/cesiumContainer.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { geocodeLocation } from './api/nominatim.js'

/**
 * Main function to initialize the Cesium viewer, fetch meteorite data, and set up the sidebar for filtering.
 * 
 * The function initializes the Cesium viewer, fetches meteorite data from the API, and adds markers to the map based on the fetched data.
 * It also sets up event listeners for radio buttons in the sidebar to filter meteorites by mass category (small, medium, large, enormous).
 * When a radio button is selected, the markers on the map are updated to show only the meteorites that fall into the selected mass category.
 * 
 * @returns {Promise<void>} - A promise that resolves when the application has been initialized and is ready for user interaction.
 * @see https://community.cesium.com/t/assigning-various-properties-to-an-entity-pin-billboard/6753/2
 * @see https://sandcastle.cesium.com/?id=geometry-and-appearances
 * @see https://community.cesium.com/t/add-marker/6497
 * @see https://community.cesium.com/t/show-marker-on-current-location-in-cesium/15174/2
 * @see https://community.cesium.com/t/show-marker-on-current-location-in-cesium/15174
 * @see https://community.cesium.com/t/show-marker-on-current-location-in-cesium/15174/3
 * @see https://stackoverflow.com/questions/65788440/cesium-trigger-event-when-a-point-is-selected
 * @see https://icons.getbootstrap.com/icons/geo-alt/
 */
async function startApp() {
  // Initialize Cesium viewer map
  const viewer = initViewer()
  try {
    const allMeteorites = await fetchMeteorites()
    addMarkers(viewer, allMeteorites)
    // Set up the sidebar with event listeners for filtering meteorites by mass
    sideBar(viewer, allMeteorites)

    viewer.selectedEntityChanged.addEventListener(async () => {
      const entity = viewer.selectedEntity
      if (entity && entity.properties) {
        const lon = entity.properties.reclong.getValue()
        const lat = entity.properties.reclat.getValue()
        
        try {
          // Fetch the geocoded location data from the Nominatim API using the longitude and latitude of the selected entity
          const locationData = await geocodeLocation(lon, lat)
          const address = locationData.display_name
          console.log('Found location:', locationData.display_name)
          console.log('Found the following location:', address)


          // Update the description of the selected entity with the fetched address, 
          // replacing the placeholder text "Fetching location..." with the actual address
          // Cesium constraints require us to use .getValue() to get the current description value
          // we then replace the placeholder text (Fectching location) with the newly fetched adress
          // we finally update the entity description with the new HTML string
          const currentHtml = entity.description.getValue()
          const updatedHtml = currentHtml.replace('Fetching location...', address)
          entity.description = updatedHtml


        } catch (err) {
          console.error('Could not fetch location:', err)
          const currentHtml = entity.description.getValue()
          entity.description = currentHtml.replace('Fetching location...', 'Location not found')
        }
      }
    })
   
  } catch (error) {
    console.error('Error initializing Cesium viewer:', error)
  }
}

/**
 * Sets up the sidebar with event listeners for filtering meteorites by class.
 * When a radio button is selected, the markers on the map are updated to show only the meteorites of the selected class.
 * The filtering is done by mass, with predefined categories for small, medium, large, and enormous meteorites. 
 *
 * @param {import('cesium').Viewer} viewer - Cesium viewer instance to update the markers on the map.
 * @param {Array<object>} data - Array of meteorite data to filter and display on the map.
 */
function sideBar(viewer, data) {
  const radioButtons = document.querySelectorAll('input[name="mass"]')

  radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const selectedSize = e.target.value
      console.log('filter by size:', selectedSize)

      // Filter the meteorites based on the selected size category
      // turns it into a number
      const filteredMeteorites = data.filter(m => {
        const mass = parseFloat(m.mass) || 0

        if (selectedSize === 'all') return true
        if (selectedSize === 'small') return mass < 250
        if (selectedSize === 'medium') return mass >= 250 && mass < 5000
        if (selectedSize === 'large') return mass >= 5000 && mass < 100000
        if (selectedSize === 'enormous') return mass >= 100000

        return true
      })

      // Update the markers on the map with the filtered meteorites
      addMarkers(viewer, filteredMeteorites)
    })
  })
}


startApp()