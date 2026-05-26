import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file')
  process.exit(1)
}

// MongoDB Connection
const client = new MongoClient(MONGODB_URI)
let db

async function connectDB() {
  try {
    await client.connect()
    db = client.db('automobiles')
    console.log('✅ Connected to MongoDB Atlas')
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  }
}

// Supabase JWT Verification Middleware
function verifySupabaseToken(req, res, next) {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized - No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // If SUPABASE_JWT_SECRET is set, verify the token
    if (SUPABASE_JWT_SECRET) {
      const decoded = jwt.verify(token, SUPABASE_JWT_SECRET, {
        algorithms: ['HS256']
      })
      req.user = decoded
    } else {
      // If no secret configured, just decode without verification (dev mode)
      const decoded = jwt.decode(token)
      req.user = decoded
      console.warn('⚠️ SUPABASE_JWT_SECRET not set - skipping token verification (dev mode)')
    }
    next()
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized - Invalid token' })
  }
}

// API Routes (all protected)

// Get all cars
app.get('/api/cars', verifySupabaseToken, async (req, res) => {
  try {
    const { category, search, sort } = req.query
    let query = {}

    if (category && category !== 'All') {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ]
    }

    let sortOption = {}
    if (sort === 'price-asc') sortOption = { priceNum: 1 }
    else if (sort === 'price-desc') sortOption = { priceNum: -1 }
    else if (sort === 'hp') sortOption = { horsepower: -1 }
    else sortOption = { name: 1 }

    const cars = await db.collection('cars').find(query).sort(sortOption).toArray()
    res.json({ success: true, cars })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Seed database with cars
app.post('/api/cars/seed', verifySupabaseToken, async (req, res) => {
  try {
    const { cars } = req.body
    await db.collection('cars').deleteMany({})
    const result = await db.collection('cars').insertMany(cars)
    res.json({ success: true, inserted: result.insertedCount })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Get car categories
app.get('/api/categories', verifySupabaseToken, async (req, res) => {
  try {
    const categories = await db.collection('cars').distinct('category')
    res.json({ success: true, categories })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Health check (public)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: db ? 'connected' : 'disconnected' })
})

// Serve static files in production
app.use(express.static(path.join(__dirname, '../dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`)
    console.log(`📁 API endpoints:`)
    console.log(`   GET  /api/cars`)
    console.log(`   POST /api/cars/seed`)
    console.log(`   GET  /api/categories`)
    console.log(`   GET  /api/health`)
  })
})
