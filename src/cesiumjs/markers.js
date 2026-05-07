import { Cartesian3, Color, PinBuilder, Viewer, VerticalOrigin } from 'cesium'
import { geocodeLocation } from '../api/nominatim.js'
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

  const pinBuilder = new PinBuilder()
  const pin = pinBuilder.fromColor(Color.RED, 48).toDataURL()

  console.log(meteorites)
  meteorites.forEach(meteorite => {
    const { fall, mass, name, recclass, reclat, reclong, year } = meteorite
 
    viewer.entities.add({
      name,
      position: Cartesian3.fromDegrees(reclong, reclat),
      properties: {
        reclong,
        reclat,
      },
      billboard: {
        image: pin,
        verticalOrigin: VerticalOrigin.BOTTOM,
      },
      description: `
        <h2>${name}</h2>
        <p><strong>Location:</strong>.   </p> 
        <p><strong>Year:</strong> ${year}</p>
         <p><strong>Class:</strong> ${recclass}</p>
         <p><strong>Mass:</strong> ${mass} grams</p>
         <p><strong>Fall:</strong> ${fall}</p>
      `,
    })
  })  
  viewer.selectedEntityChanged.addEventListener( async (entities) => {
    const clickedEntity = viewer.selectedEntity
    if ( clickedEntity && clickedEntity.properties) {
      console.log('Clicked entity')
      console.log(clickedEntity)
      console.log(entities)
      const { reclat, reclong } = clickedEntity.properties
      console.log('before clickedEntity.properties')

      console.log(clickedEntity.properties)
      console.log('after clickedEntity.properties')

      geocodeLocation(reclong.getValue(), reclat.getValue()).then(locationData => {
        console.log('Geocoded location data:', locationData)
      }).catch(error => {
        console.error('Error geocoding location:', error)
      })
    }
  })
}