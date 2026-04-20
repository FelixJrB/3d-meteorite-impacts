import { Cartesian3, Color, PinBuilder, Viewer, VerticalOrigin } from 'cesium'

/**
 * Markers for my meteorite impacts created through nominatim API with geolocation (Long, lat).
 * 
 * Each marker has a description with name, class, mass, fall
 * insspiration taken from:
 * 
 * https://community.cesium.com/t/assigning-various-properties-to-an-entity-pin-billboard/6753/2
 * https://sandcastle.cesium.com/?id=geometry-and-appearances
 * 
 * @param {Viewer} viewer - Cesium viewer, initilizes Cesium globe and scene.
 * @param {Array} meteorites - Array of meteorites to render with API from NASA and others.
 */
export function addMarkers(viewer, meteorites) {

  const pinBuilder = new PinBuilder()
  const pin = pinBuilder.fromColor(Color.RED, 48).toDataURL()

  meteorites.forEach(meteorite => {
    const { fall, mass, name, recclass, reclat, reclong, year } = meteorite
 
    viewer.entities.add({
      name,
      position: Cartesian3.fromDegrees(reclong, reclat),
      billboard: {
        image: pin,
        verticalOrigin: VerticalOrigin.BOTTOM,
      },
      description: `
        <h2>${name}</h2>
         <p><strong>Class:</strong> ${recclass}</p>
         <p><strong>Mass:</strong> ${mass} grams</p>
         <p><strong>Fall:</strong> ${fall}</p>
         <p><strong>Year:</strong> ${year}</p>
      `,
    })
  })
}