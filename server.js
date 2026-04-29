import express from 'express'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { connectToMongoDB } from './src/config/mongoose.js'


const __dirname = dirname(fileURLToPath(import.meta.url))

await connectToMongoDB(process.env.DATABASE_URL || 'mongodb://localhost:27017/meteorite-impacts')


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())



app.get('/api/meteorites', async (_req, res) => {
  let all

  try {
    const response = await fetch(
      'https://data.nasa.gov/docs/legacy/meteorite_landings/Meteorite_Landings.json',
      { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
    const json = await response.json()
    all = json.data || []
  } catch {
    all = []
  }

  if (all.length < 10000) {
    const filePath = join(__dirname, 'src/meteoriteDataBackup/meteorite_landings.json')
    const fileContent = await readFile(filePath, 'utf-8')
    all = JSON.parse(fileContent).data || []
  }

  const meteorites = all
    .filter(m => m[15] && m[16])
    .map(m => ({
      name: m[8],
      recclass: m[11],
      mass: m[12],
      fall: m[13],
      year: m[14],
      reclat: parseFloat(m[15]),
      reclong: parseFloat(m[16]),
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