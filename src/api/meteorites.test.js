import { expect, test } from 'vitest'
import { filterMeteorites } from '../utils/filterMeteorites.js'

const testData = [
  { name: 'Meteorite 1', mass: '100', year: '1953-03-01' },
  { name: 'Meteorite 2', mass: '250', year: '1967-07-23' },
  { name: 'Meteorite 3', mass: '2000', year: '2008-10-12' },
  { name: 'Meteorite 4', mass: '5000', year: '2012-05-26' },
  { name: 'Meteorite 5', mass: '15000', year: '2015-03-23' },
]

test('Small filter returns correct meteorite with a mass of <250', () => {
  const massFiltered = filterMeteorites(testData, 'small', null, null, '')
  expect(massFiltered).toHaveLength(1)
  expect(massFiltered[0]).toHaveProperty('mass', '100')
})

test('Medium filter returns correct meteorite with mass of >=250 and <5000', () => {
  const massFiltered = filterMeteorites(testData, 'medium', null, null, '')
  expect(massFiltered).toHaveLength(2)
  expect(massFiltered[0]).toHaveProperty('mass', '250')
  expect(massFiltered[1]).toHaveProperty('mass', '2000')
})

test('Large filter returns correct meteorite within the mass range of >=5000 and <100000', () => {
  const massFiltered = filterMeteorites(testData, 'large', null, null, '')
  expect(massFiltered).toHaveLength(2)
  expect(massFiltered[0]).toHaveProperty('mass', '5000')
  expect(massFiltered[1]).toHaveProperty('mass', '15000')
})

test('Year filter returns a meteorite within the given raange', () => {
  const yearFiltered = filterMeteorites(testData, 'all', 2008, 2017, '')
  // from=2008, to=2017
  expect(yearFiltered).toHaveLength(3)
  expect(yearFiltered[0]).toHaveProperty('year', '2008-10-12')
  expect(yearFiltered[1]).toHaveProperty('year', '2012-05-26')
  expect(yearFiltered[2]).toHaveProperty('year', '2015-03-23')
})

test('Year filter returns no meteorites if none are within the given range', () => {
  const yearFiltered = filterMeteorites(testData, 'all', 1800, 1900, '')
  expect(yearFiltered).toHaveLength(0)
})