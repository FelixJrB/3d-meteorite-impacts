import express from 'express'
import { connectToMongoDB } from './src/config/mongoose.js'


await connectToMongoDB(process.env.DATABASE_URL || 'mongodb://localhost:27017/meteorite-impacts')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json({ limit: '500kb'}))


app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({
    status_code: err.status || 500,
    message: err.message || 'An unexpected condition was encountered.',
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
})