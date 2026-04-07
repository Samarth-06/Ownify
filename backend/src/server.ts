import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;

// Environment validation
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing environment variables:', missingEnvVars);
  console.error('Please configure backend/.env.local');
  process.exit(1);
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Supabase client with service role (for backend operations)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// JWT Helper
const JWT_SECRET = process.env.JWT_SECRET!;

function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}

// Auth Middleware
interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = decoded.userId;
  next();
};

// ====================================
// HEALTH CHECK
// ====================================

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Test Supabase connection
    const { data } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
    });
  } catch (error) {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'error',
      error: 'Database connection failed',
    });
  }
});

// ====================================
// AUTH ROUTES (Real Supabase Auth)
// ====================================

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, username, full_name } = req.body;

    console.log('📝 Register attempt:', { email, username });

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Missing required fields: email, password, username' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists using REST API
    console.log('🔍 Checking if email exists...');
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    console.log('Has Service Role Key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    try {
      const url = `${process.env.SUPABASE_URL}/rest/v1/user_profiles?email=eq.${encodeURIComponent(email)}&select=id`;
      console.log('🌐 Fetching from:', url);
      const checkEmailResponse = await fetch(url, {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('✅ Response status:', checkEmailResponse.status);
      const emailData = await checkEmailResponse.json();
      if (emailData.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    } catch (err: any) {
      console.error('❌ Error checking email:', err.message);
      console.error('Error cause:', err.cause);
      console.error('Full error:', err);
      throw err;
    }

    // Check if username already exists
    console.log('🔍 Checking if username exists...');
    try {
      const checkUserResponse = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/user_profiles?username=eq.${encodeURIComponent(username)}&select=id`,
        {
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        }
      );
      const userData = await checkUserResponse.json();
      if (userData.length > 0) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    } catch (err) {
      console.error('❌ Error checking username:', err);
      throw err;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user profile with hashed password using REST API
    console.log('💾 Creating user profile...');
    try {
      const createResponse = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/user_profiles`,
        {
          method: 'POST',
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            email,
            username,
            full_name: full_name || '',
            password_hash: hashedPassword,
          }),
        }
      );

      if (!createResponse.ok) {
        const error = await createResponse.json();
        console.error('❌ Create user error:', error);
        throw new Error(error.message || 'Failed to create user');
      }

      const [newUser] = await createResponse.json();

      if (!newUser) {
        return res.status(500).json({ error: 'User creation failed' });
      }

      console.log('✅ User created:', newUser.id);

      // Generate JWT token for immediate login
      const token = generateToken(newUser.id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          full_name: newUser.full_name,
        },
        message: 'User registered successfully',
      });
    } catch (err) {
      console.error('❌ Supabase request failed:', err);
      throw err;
    }
  } catch (error: any) {
    console.error('❌ Register error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: error.message || 'Registration failed',
      details: error.message,
      type: error.constructor.name
    });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('📝 Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user by email using REST API
    console.log('🔍 Finding user by email...');
    const userResponse = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/user_profiles?email=eq.${encodeURIComponent(email)}&select=*`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    const users = await userResponse.json();

    if (!users || users.length === 0) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify password hash
    console.log('🔐 Verifying password...');
    const passwordMatch = await bcrypt.compare(password, user.password_hash || '');

    if (!passwordMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('✅ Password verified');

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: error.message || 'Login failed',
      details: error.message,
      type: error.constructor.name
    });
  }
});

// ====================================
// USER ROUTES
// ====================================

app.get('/api/users/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error) throw new Error(error.message);
    if (!data) return res.status(404).json({ error: 'Profile not found' });

    res.json(data);
  } catch (error: any) {
    console.error('Fetch profile error:', error);
    res.status(404).json({ error: 'Profile not found' });
  }
});

app.put('/api/users/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { full_name, bio, avatar_url } = req.body;

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        full_name: full_name || undefined,
        bio: bio || undefined,
        avatar_url: avatar_url || undefined,
        updated_at: new Date(),
      })
      .eq('id', req.userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.json(data);
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(400).json({ error: error.message || 'Update failed' });
  }
});

app.get('/api/users/:username', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, username, full_name, avatar_url, bio, created_at')
      .eq('username', req.params.username)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(data);
  } catch (error: any) {
    res.status(404).json({ error: 'User not found' });
  }
});

// ====================================
// WALLET ROUTES
// ====================================

app.post('/api/wallets/connect', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { wallet_address } = req.body;

    if (!wallet_address) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    // Check if wallet already exists
    const { data: existing } = await supabase
      .from('user_wallets')
      .select('user_id')
      .eq('wallet_address', wallet_address)
      .single();

    if (existing && existing.user_id !== req.userId) {
      return res.status(400).json({ error: 'Wallet already connected to another user' });
    }

    // Upsert wallet
    const { data, error } = await supabase
      .from('user_wallets')
      .upsert(
        {
          user_id: req.userId,
          wallet_address,
          is_primary: true,
        },
        { onConflict: 'wallet_address' }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json({ success: true, wallet: data });
  } catch (error: any) {
    console.error('Connect wallet error:', error);
    res.status(400).json({ error: error.message || 'Connect wallet failed' });
  }
});

app.get('/api/wallets', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', req.userId);

    if (error) throw new Error(error.message);

    res.json(data || []);
  } catch (error: any) {
    console.error('Fetch wallets error:', error);
    res.status(400).json({ error: error.message || 'Fetch wallets failed' });
  }
});

// ====================================
// COPYRIGHT ROUTES
// ====================================

app.post('/api/copyrights', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      copyright_id,
      title,
      description,
      file_hash,
      ipfs_hash,
      license_type,
      transaction_hash,
      contract_address,
    } = req.body;

    if (!title || !file_hash) {
      return res.status(400).json({ error: 'Title and file_hash are required' });
    }

    const { data, error } = await supabase
      .from('copyrights')
      .insert({
        user_id: req.userId,
        copyright_id: copyright_id || null,
        title,
        description: description || '',
        file_hash,
        ipfs_hash: ipfs_hash || '',
        license_type: license_type || '',
        transaction_hash: transaction_hash || '',
        contract_address: contract_address || '',
        registered_at: new Date(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json({ success: true, copyright: data });
  } catch (error: any) {
    console.error('Create copyright error:', error);
    res.status(400).json({ error: error.message || 'Create copyright failed' });
  }
});

app.get('/api/copyrights', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('copyrights')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    res.json(data || []);
  } catch (error: any) {
    console.error('Fetch copyrights error:', error);
    res.status(400).json({ error: error.message || 'Fetch copyrights failed' });
  }
});

app.get('/api/copyrights/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('copyrights')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error) throw new Error(error.message);

    res.json(data);
  } catch (error: any) {
    res.status(404).json({ error: 'Copyright not found' });
  }
});

app.get('/api/users/:username/copyrights', async (req: Request, res: Response) => {
  try {
    // Get user by username
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', req.params.username)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get copyrights
    const { data, error } = await supabase
      .from('copyrights')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    res.json({
      success: true,
      count: data?.length || 0,
      copyrights: data || [],
    });
  } catch (error: any) {
    res.status(404).json({ error: error.message || 'Copyrights not found' });
  }
});

// PUBLIC: Get all copyrights feed (visible to everyone)
app.get('/api/copyrights/feed/all', async (req: Request, res: Response) => {
  try {
    console.log('📺 Fetching public copyright feed...');

    // Get all copyrights with user info
    const { data, error } = await supabase
      .from('copyrights')
      .select(`
        id,
        user_id,
        title,
        description,
        file_hash,
        ipfs_hash,
        license_type,
        created_at,
        user_profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);

    res.json({
      success: true,
      count: data?.length || 0,
      copyrights: data || []
    });
  } catch (error: any) {
    console.error('❌ Fetch copyright feed error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch copyright feed' });
  }
});

// ====================================
// STATS ROUTES
// ====================================

app.get('/api/stats/dashboard', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Copyright count
    const { count: copyrightCount } = await supabase
      .from('copyrights')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.userId);

    // Wallet count
    const { count: walletCount } = await supabase
      .from('user_wallets')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.userId);

    // Recent copyrights
    const { data: recentCopyrights } = await supabase
      .from('copyrights')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      copyrightCount: copyrightCount || 0,
      walletCount: walletCount || 0,
      recentCopyrights: recentCopyrights || [],
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(400).json({ error: error.message || 'Stats fetch failed' });
  }
});

// ====================================
// ERROR HANDLERS
// ====================================

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ====================================
// START SERVER
// ====================================

app.listen(PORT, () => {
  console.log(`✅ Backend API running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available`);
  console.log(`🗄️  Database: Supabase (connected)`);
  console.log(`🔐 Authentication: Supabase Auth`);
});
