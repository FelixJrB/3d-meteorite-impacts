import { Cartesian3, CustomDataSource, HorizontalOrigin, VerticalOrigin, Viewer } from 'cesium'
/**
 * Helper function to determine marker color based on mass of the meteorite.
 *
 * @param {number} mass - Mass of the meteorite in grams, used to determine marker color.
 * @returns {string} - Hex color code for the marker based on mass category.
 */
function getMassColor(mass) {
  const grams = parseFloat(mass) || 0
  if (grams < 250) return '#fce38a' // Small
  if (grams < 5000) return '#f9a825' // Medium
  if (grams < 100000) return '#d84315' // Large
  return '#9d4edd' // Enormous
}

/**
 * Draws a circle with a count number on a canvas and returns it as a data URL.
 *
 * @param {number} count - The number of clustered entities, used to determine the size of the circle and the displayed count.
 * @returns {string} - A data URL representing the generated cluster circle image.
 */
function makeClusterCircle(count) {
  const size = count > 999 ? 64 : count > 99 ? 56 : 48
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(231, 76, 60, 0.85)'
  ctx.fill()
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.fillStyle = 'white'
  ctx.font = `bold ${size > 56 ? 18 : 14}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(count), size / 2, size / 2)
  return canvas.toDataURL()
}

/**
 * Markers for my meteorite impacts created through nominatim API with geolocation (Long, lat).
 * 
 * Each marker has a description with name, class, mass, fall
 * insspiration taken from:
 * 
 * @see https://community.cesium.com/t/assigning-various-properties-to-an-entity-pin-billboard/6753/2
 * @see https://sandcastle.cesium.com/?id=geometry-and-appearances
 * @see https://community.cesium.com/t/add-marker/6497
 * @see https://community.cesium.com/t/show-marker-on-current-location-in-cesium/15174/2
 * @see https://community.cesium.com/t/show-marker-on-current-location-in-cesium/15174
 * @see https://community.cesium.com/t/show-marker-on-current-location-in-cesium/15174/3
 * @see https://stackoverflow.com/questions/65788440/cesium-trigger-event-when-a-point-is-selected
 * @see https://ux.stackexchange.com/questions/33789/multiple-map-markers-on-one-location
 * @param {Viewer} viewer - Cesium viewer, initilizes Cesium globe and scene.
 * @param {Array} meteorites - Array of meteorites to render with API from NASA and others.
 */
export function addMarkers(viewer, meteorites) {

  viewer.entities.removeAll()
  viewer.dataSources.removeAll()

  const dataSource = new CustomDataSource('meteorites')

  dataSource.clustering.enabled = true
  dataSource.clustering.pixelRange = 180
  dataSource.clustering.minimumClusterSize = 3

  dataSource.clustering.clusterBillboards = true
  dataSource.clustering.clusterPoints = true

  viewer.camera.changed.addEventListener(() => {
    const altitude = viewer.camera.positionCartographic.height

    // Dynamically adjust clustering based on camera altitude to optimize performance and visualization
    if (altitude > 10000000) {
      // Global view, cluster all meteorites together
      dataSource.clustering.pixelRange = 300
    } else if (altitude > 4000000) {
      // Continental view, cluster meteorites within a reasonable pixel range to avoid clutter
      dataSource.clustering.pixelRange = 120
    } else {
      // Local view, show individual markers without clustering for detailed exploration
      dataSource.clustering.pixelRange = 0
    }
  })

  dataSource.clustering.clusterEvent.addEventListener((entities, cluster) => {
    cluster.label.show = false
    cluster.billboard.show = true
    cluster.billboard.image = makeClusterCircle(entities.length)
    cluster.billboard.horizontalOrigin = HorizontalOrigin.CENTER
    cluster.billboard.verticalOrigin = VerticalOrigin.CENTER
  })

  console.log(meteorites)
  meteorites.forEach(meteorite => {
    const { fall, mass, name, recclass, reclat, reclong, year } = meteorite
    const markerColor = getMassColor(mass)
    const displayYear = year ? new Date(year).getFullYear() : 'Unknown'
    const grams = Number(mass)

    const kg = grams / 1000

    const fromGramsToKg = grams + ' grams (' + kg +' kg)' 

    // SVg Icon for the marker, color is determined by mass of the meteorite, inspiration taken from https://icons.getbootstrap.com/icons/geo-alt/
    const svgIcon = ` <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" fill="${markerColor}" viewBox="0 0 16 16">
      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
    </svg>`

    const pin = 'data:image/svg+xml,' + encodeURIComponent(svgIcon)

    dataSource.entities.add({
      name,
      position: Cartesian3.fromDegrees(parseFloat(reclong), parseFloat(reclat)),
      properties: {
        reclong: parseFloat(reclong),
        reclat: parseFloat(reclat),
      },
      billboard: {
        image: pin,
        verticalOrigin: VerticalOrigin.BOTTOM,
      },
      description: `
        <h2>${name}</h2>
        <p><strong>Location:</strong>Fetching location...</p>
        <p><strong>Year:</strong> ${displayYear}</p>
        <p><strong>Class:</strong> ${recclass}</p>
        <p><strong>Mass:</strong> ${fromGramsToKg}</p>
        <p><strong>Fall:</strong> ${fall}</p>
      `,
    })
  })
  viewer.dataSources.add(dataSource)
}