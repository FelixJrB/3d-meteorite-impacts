/**
 * Fethes meteorite data from NASA API and filters out meteorites without geolocation (long and lat).
 * 
 * @returns {Array} Array of meteorites with geolocation data.
 */
export async function fetchMeteorites() {
  // TODO: hämta data från NASA API
  // glöm inte meteoriter som brinner upp i atmosfären
  // long och lat med nomination för geolocation.

  const meteoriteData = await fetch('/api/meteorites')
  const jsonData = await meteoriteData.json()

  console.log(jsonData[169])

  const filteredMeteorites = jsonData.filter(m => m.reclat && m.reclong)

  return filteredMeteorites



  // const APIresponse = await fetch('')
}
