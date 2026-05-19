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
  // cacha meteorite data i local storage, så att det inte behöver hämtas varje gång sidan laddas, och så att det finns data även när API:et inte är tillgängligt.
  console.log(meteoriteData)
  console.log(jsonData)

  const filteredMeteorites = jsonData.filter(m => m.reclat && m.reclong && m.year)
  console.log(filteredMeteorites)

  return filteredMeteorites


  // const APIresponse = await fetch('')
}
