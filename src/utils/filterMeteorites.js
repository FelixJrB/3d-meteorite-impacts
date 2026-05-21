/**
 * Filters meteorite data based on state mass, year, location
 *
 * @param {Array<object>} data - Array of all meteorite data.
 *  @param {string} selectedSize - Mass category: 'all', 'small', 'medium', 'large' or 'enormous'.
 * @param {number|null} from - Minimum year, or null for no lower bound.
 * @param {number|null} to - Maximum year, or null for no upper bound.
 * @param {string} location - Location name to search for, or empty string for no filter.
 * @returns {Array<object>} Filtered array of meteorites.
 */
export function filterMeteorites(data, selectedSize, from, to, location) {

  return data.filter(m => {
    const mass = parseFloat(m.mass) || 0
    const year = m.year ? new Date(m.year).getFullYear() : null

    if (selectedSize === 'small' && mass >= 250) return false
    if (selectedSize === 'medium' && (mass < 250 || mass >= 5000)) return false
    if (selectedSize === 'large' && (mass < 5000 || mass >= 100000)) return false
    if (selectedSize === 'enormous' && mass < 100000) return false
    if (from !== null && year !== null && year < from) return false
    if (to !== null && year !== null && year > to) return false
    if (location && !m.name.toLowerCase().includes(location)) return false

    return true
  })
}