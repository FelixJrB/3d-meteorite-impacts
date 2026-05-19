/**
 * Nominatim API for geocoding and reverse geocoding, used to get the location of the meteorite impacts.
 *
 * Inspiration taken from;
 * https;//nominatim.org/release-docs/develop/api/Output/
 *
 * @param {number} reclong - Longitude of the meteorite impact.
 * @param {number} reclat - Latitude of the meteorite impact.
 * @returns {object} - Geocoded location data from Nominatim API.
 */
export async function geocodeLocation(reclong, reclat) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${reclat}&lon=${reclong}`)
  const data = await response.json()
  console.log('Geocoded location data:', data)
  return data
}

