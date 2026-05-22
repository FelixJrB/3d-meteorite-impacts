import { vi, expect, test } from 'vitest'
import { geocodeLocation } from './nominatim.js'

test('geocodeLocation returns data from Nominatim API', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ display_name: 'Stockholm, Sweden' }),
  }))

  const result = await geocodeLocation(18.06, 59.33)
  expect(result).toHaveProperty('display_name', 'Stockholm, Sweden')

  vi.unstubAllGlobals()
})