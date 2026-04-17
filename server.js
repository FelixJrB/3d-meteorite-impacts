import express from 'express'
import { connectToMongoDB } from './src/config/mongoose.js'


// await connectToMongoDB(process.env.DATABASE_URL || 'mongodb://localhost:27017/meteorite-impacts')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json({ limit: '500kb'}))

// app.get('/api/meteorites', async (req, res) => {
//   const response = await fetch('https://data.nasa.gov/docs/legacy/meteorite_landings/Meteorite_Landings.json', {
//     redirect: 'follow',
//     headers: {
//       'User-Agent': 'Mozilla/5.0'
//     }
//   })
//   const data = await response.json()
//   res.json(data)
// })

app.get('/api/meteorites', async (req, res) => {
  const limit = 1000
  let offset = 0
  let all = []
  let batch

  do {
    const response = await fetch(
      `https://data.nasa.gov/docs/legacy/meteorite_landings/Meteorite_Landings.json?$limit=${limit}&$offset=${offset}`,
      { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
    const json = await response.json()
    batch = json.data || []
    all = all.concat(batch)
    offset += limit
  } while (batch.length === limit)

  const meteorites = all
    .filter(m => m[15] && m[16])
    .map(m => ({
      name: m[8],
      recclass: m[11],
      mass: m[12],
      fall: m[13],
      year: m[14],
      reclat: parseFloat(m[15]),
      reclong: parseFloat(m[16])
    }))

  res.json(meteorites)
})

app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({
    status_code: err.status || 500,
    message: err.message || 'An unexpected condition was encountered.',
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
})