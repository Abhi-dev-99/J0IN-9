const supabaseAdmin = require('../lib/supabase');
const prisma = require('../lib/prisma');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Find or create local user record linked to Supabase auth
    let dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { supabaseId: user.id, email: user.email }
      });
    }

    req.user = {
      id: dbUser.id,
      supabaseId: user.id,
      email: user.email
    };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Authentication failed' });
  }
}

module.exports = { requireAuth };
