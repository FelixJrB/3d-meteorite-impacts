/**
 * Fethes meteorite data from NASA API and filters out meteorites without geolocation (long and lat).
 * 
 * @returns {Array} Array of meteorites with geolocation data.
 */
export async function fetchMeteorites() {

  const meteoriteData = await fetch('/api/meteorites')
  const jsonData = await meteoriteData.json()

  const filteredMeteorites = jsonData.filter(m => m.reclat && m.reclong && m.year)
  return filteredMeteorites

}
