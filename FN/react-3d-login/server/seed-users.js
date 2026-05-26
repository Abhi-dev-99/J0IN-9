import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const dummyUsers = [
  { email: 'demo@automobiles.com', password: 'password123', name: 'Demo User' },
  { email: 'test@automobiles.com', password: 'password123', name: 'Test User' },
  { email: 'alice@automobiles.com', password: 'password123', name: 'Alice' },
  { email: 'bob@automobiles.com', password: 'password123', name: 'Bob' },
  { email: 'admin@automobiles.com', password: 'password123', name: 'Admin' },
]

async function seedUsers() {
  console.log('🌱 Creating dummy users in Supabase...\n')

  for (const user of dummyUsers) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          full_name: user.name,
        },
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`⚠️  ${user.email} — already exists`)
      } else {
        console.log(`❌ ${user.email} — ${error.message}`)
      }
    } else {
      console.log(`✅ ${user.email} — created (User ID: ${data.user?.id})`)
    }
  }

  console.log('\n📋 Dummy User Credentials:')
  console.log('─────────────────────────────────────────')
  dummyUsers.forEach(u => {
    console.log(`Email:    ${u.email}`)
    console.log(`Password: ${u.password}`)
    console.log('─────────────────────────────────────────')
  })

  console.log('\n⚠️  IMPORTANT: If "Confirm email" is enabled in Supabase,')
  console.log('   users will need to verify their email before logging in.')
  console.log('   Go to Supabase → Authentication → Providers → Email')
  console.log('   and disable "Confirm email" for testing.\n')
}

seedUsers()
