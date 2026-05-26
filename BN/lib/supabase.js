const WebSocket = require('ws');

// Polyfill WebSocket for Node.js < 22 (required by Supabase Realtime)
if (!global.WebSocket) {
  global.WebSocket = WebSocket;
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    realtime: {
      transport: WebSocket
    }
  });
} else {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Auth will not work.');
  supabase = {
    auth: {
      admin: {
        createUser: async () => {
          throw new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
        }
      },
      signInWithPassword: async () => {
        throw new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
      },
      getUser: async () => {
        throw new Error('Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
      }
    }
  };
}

module.exports = supabase;
