import { Cartesian3, VerticalOrigin, Viewer } from 'cesium'

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
 * @param {Viewer} viewer - Cesium viewer, initilizes Cesium globe and scene.
 * @param {Array} meteorites - Array of meteorites to render with API from NASA and others.
 */
export function addMarkers(viewer, meteorites) {

  viewer.entities.removeAll()

  console.log(meteorites)
  meteorites.forEach(meteorite => {
    const { fall, mass, name, recclass, reclat, reclong, year } = meteorite
    const markerColor = getMassColor(mass)

    const grams = Number(mass)

    const Kg = grams / 1000

    const fromGramsToKg = grams + ' grams (' + Kg +' kg)' 

    const svgIcon = ` <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="${markerColor}" viewBox="0 0 16 16">
      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
    </svg>`

    const pin = 'data:image/svg+xml,' + encodeURIComponent(svgIcon)

    viewer.entities.add({
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
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Class:</strong> ${recclass}</p>
        <p><strong>Mass:</strong> ${fromGramsToKg}</p>
        <p><strong>Fall:</strong> ${fall}</p>
      `,
    })
  })  
}