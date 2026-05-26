import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Warn if using placeholder values
if (supabaseUrl?.includes('your-project') || supabaseAnonKey?.includes('your-anon')) {
  console.error(
    '%c⚠️  SUPABASE NOT CONFIGURED',
    'color: #f44336; font-size: 16px; font-weight: bold;'
  )
  console.error(
    '%cYou need to add your real Supabase credentials to the .env file.\n' +
    '1. Go to https://app.supabase.com\n' +
    '2. Open your project → Settings → API\n' +
    '3. Copy URL and anon key to .env',
    'color: #9fa8da; font-size: 13px;'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
