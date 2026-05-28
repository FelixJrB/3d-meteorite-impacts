import { initViewer } from './cesiumjs/viewer.js'
import { fetchMeteorites } from './api/meteorites.js'
import { addMarkers } from './cesiumjs/markers.js'
import './styles/cesiumContainer.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { geocodeLocation } from './api/nominatim.js'
import { filterMeteorites } from './utils/filterMeteorites.js'

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
  initResizableSidebar()
  toggleSidebar()
  viewer.scene.globe.enableLighting = true
  try {
    const allMeteorites = await fetchMeteorites()
    addMarkers(viewer, allMeteorites)
  
    // Set up the sidebar with event listeners for filtering meteorites by mass
    meteoriteMass(viewer, allMeteorites)
    yearFilter(viewer, allMeteorites)
    locationFilter(viewer, allMeteorites)
    resetFilters(viewer, allMeteorites)

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
 * Toggles the visibility of the sidebar and the toggle button for small screens.
 * When the close button in the sidebar is clicked, the sidebar is hidden and the toggle button is shown.
 * When the toggle button is clicked, the sidebar is shown and the toggle button is hidden.
 * This function enhances the user experience on smaller screens by allowing users to easily show or hide the sidebar as needed.
 *
 * @returns {void}
 * @see https://getbootstrap.com/docs/5.0/components/navbar/#toggler
 */
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar')
  const closeBtn = document.querySelector('.btn-close')
  const toggleBtn = document.createElement('button')

  toggleBtn.textContent = '☰'
  toggleBtn.classList.add('sidebar-toggle') 
  document.body.appendChild(toggleBtn)

  closeBtn.addEventListener('click', () => {
    sidebar.style.display = 'none'
    toggleBtn.style.display = 'block'
  })

  toggleBtn.addEventListener('click', () => {
    sidebar.style.display = ''
    toggleBtn.style.display = 'none'
  })
}

/**
 * Initializes the resizable sidebar by adding event listeners for mouse actions.
 * The sidebar can be resized by dragging its right edge, and the cursor changes to indicate when resizing is possible.
 * The function listens for mousedown events on the sidebar to start resizing, mousemove events on 
 * the document to adjust the width of the sidebar while resizing, and mouseup events to stop resizing.
 * It also ensures that the sidebar width stays within a defined range (395px to 1250px) to maintain usability and prevent layout issues.
 */
function initResizableSidebar() {
  const sidebar = document.querySelector('.sidebar')
  let isResizing = false

  sidebar.addEventListener('mousedown', (e) => {
    if (e.offsetX > sidebar.offsetWidth - 10) {
      isResizing = true
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }
  })

  sidebar.addEventListener('mousemove', (e) => {
    sidebar.style.cursor = e.offsetX > sidebar.offsetWidth - 10 ? 'col-resize' : 'default'
  })

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return
    const newWidth = e.clientX
    if (newWidth >= 395 && newWidth <= 1250) {
      sidebar.style.width = `${newWidth}px`
    }
  })

  document.addEventListener('mouseup', () => {
    isResizing = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  })

}
/**
 * Resets all filters in the sidebar to their default state and updates the markers on the map to show all meteorites.
 * This function is called when the "Reset filters" button is clicked. It unchecks all mass filter radio buttons, clears the year from/to inputs, and clears the location search input.
 * After resetting the filters, it calls addMarkers to update the map with all meteorites.
 *
 * @param {import('cesium').Viewer} viewer - Cesium viewer instance.
 * @param {Array<object>} data - Array of all meteorite data.
 * @returns {void}
 * @see https://getbootstrap.com/docs/5.0/forms/checks-radios/#radios
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checked
 */
function resetFilters(viewer, data) {
  document.getElementById('resetFilters').addEventListener('click', () => {
    document.querySelectorAll('input[name="mass"]').forEach(r => r.checked = false)
    document.getElementById('yearFrom').value = ''
    document.getElementById('yearTo').value = ''
    document.getElementById('searchlocation').value = ''
    addMarkers(viewer, data)
  })
}
/**
 * Sets up event listeners for mass filter radio buttons.
 * When a radio button is selected, applyFilters is called to update the markers.
 *
 * @param {import('cesium').Viewer} viewer - Cesium viewer instance.
 * @param {Array<object>} data - Array of all meteorite data.
 */
function meteoriteMass(viewer, data) {
  document.querySelectorAll('input[name="mass"]').forEach(radio => {
    radio.addEventListener('change', () => applyFilters(viewer, data))
  })
}

/**
 * Sets up event listeners for the year from/to inputs.
 * When either input changes, applyFilters is called to update the markers.
 *
 * @param {import('cesium').Viewer} viewer - Cesium viewer instance.
 * @param {Array<object>} data - Array of all meteorite data.
 */
function yearFilter(viewer, data) {
  /**
   * Helper function to apply filters when the "Apply" button is clicked or when Enter is pressed in the year input fields.
   * This function calls applyFilters to update the markers based on the current filter values.
   *
   * @returns {void}
   */
  const apply = () => applyFilters(viewer, data)

  document.getElementById('applyYear').addEventListener('click', apply)

  document.getElementById('yearFrom').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') apply()
  })
  document.getElementById('yearTo').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') apply()
  })
}

/**
 * Sets up event listener for the location search input.
 * When the input changes, applyFilters is called to update the markers.
 *
 * @param {import('cesium').Viewer} viewer - Cesium viewer instance.
 * @param {Array<object>} data - Array of all meteorite data.
 */
function locationFilter(viewer, data) {

  document.getElementById('applyLocation').addEventListener('click', () => applyFilters(viewer, data))
  document.getElementById('searchlocation').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applyFilters(viewer, data)
  })
}

/**
 * Applies the selected filters to the meteorite data and updates the map markers.
 *
 * @param {import('cesium').Viewer} viewer - Cesium viewer instance.
 * @param {Array<object>} data - Array of all meteorite data.
 */
function applyFilters(viewer, data) {
  const selectedSize = document.querySelector('input[name="mass"]:checked')?.value ?? 'all'
  const from = parseInt(document.getElementById('yearFrom').value) || null
  const to = parseInt(document.getElementById('yearTo').value) || null
  const location = document.getElementById('searchlocation').value.toLowerCase().trim()

  const filtered = filterMeteorites(data, selectedSize, from, to, location)

  // Update the markers on the map with the filtered meteorites
  addMarkers(viewer, filtered)

}

startApp()