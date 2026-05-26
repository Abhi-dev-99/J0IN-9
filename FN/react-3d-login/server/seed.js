import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import { cars } from '../src/data/cars.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file')
  process.exit(1)
}

async function seed() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('automobiles')
    
    console.log('🌱 Seeding database...')
    
    // Clear existing cars
    await db.collection('cars').deleteMany({})
    
    // Insert all cars
    const result = await db.collection('cars').insertMany(cars)
    
    console.log(`✅ Seeded ${result.insertedCount} cars into MongoDB Atlas!`)
    console.log(`📊 Database: automobiles`)
    console.log(`📁 Collection: cars`)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
  } finally {
    await client.close()
  }
}

seed()
