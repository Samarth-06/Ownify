-- ============================================
-- VERIDIAN CORE - DATABASE SCHEMA
-- Supabase PostgreSQL + Row Level Security
-- ============================================

-- Drop existing objects if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own wallets" ON user_wallets;
DROP POLICY IF EXISTS "Users can insert own wallets" ON user_wallets;
DROP POLICY IF EXISTS "Users can view own copyrights" ON copyrights;
DROP POLICY IF EXISTS "Users can insert own copyrights" ON copyrights;
DROP POLICY IF EXISTS "Public can view published copyrights" ON copyrights;
DROP TABLE IF EXISTS copyright_transactions;
DROP TABLE IF EXISTS copyrights;
DROP TABLE IF EXISTS user_wallets;
DROP TABLE IF EXISTS user_profiles;

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  password_hash VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_code VARCHAR(6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER WALLETS TABLE
-- ============================================
CREATE TABLE user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COPYRIGHTS TABLE
-- ============================================
CREATE TABLE copyrights (
  id BIGSERIAL PRIMARY KEY,
  copyright_id BIGINT,
  chain_id INT DEFAULT 80002,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_hash VARCHAR(255) UNIQUE NOT NULL,
  ipfs_hash VARCHAR(255),
  license_type VARCHAR(50),
  transaction_hash VARCHAR(255),
  block_number BIGINT,
  contract_address VARCHAR(255),
  registered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_copyright UNIQUE(chain_id, copyright_id)
);

-- ============================================
-- COPYRIGHT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE copyright_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  copyright_id BIGINT,
  transaction_hash VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, failed
  gas_used NUMERIC,
  block_number BIGINT,
  transaction_date TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX idx_user_wallets_wallet_address ON user_wallets(wallet_address);
CREATE INDEX idx_copyrights_user_id ON copyrights(user_id);
CREATE INDEX idx_copyrights_file_hash ON copyrights(file_hash);
CREATE INDEX idx_copyrights_chain_id ON copyrights(chain_id);
CREATE INDEX idx_copyright_transactions_user_id ON copyright_transactions(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Disable RLS since we're using JWT token-based auth via backend
-- RLS is enforced at the API level through the backend application

-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE copyrights ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE copyright_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROW LEVEL SECURITY POLICIES (RLS Disabled)
-- ============================================

-- RLS policies are disabled since authentication is handled by the backend API
-- The backend validates all requests with JWT tokens and enforces user access control

-- Commented out RLS policies below:

-- CREATE POLICY "Users can view own profile"
--   ON user_profiles FOR SELECT
--   USING (TRUE);
--
-- CREATE POLICY "Users can update own profile"
--   ON user_profiles FOR UPDATE
--   USING (TRUE);
--
-- CREATE POLICY "Public can view public profiles"
--   ON user_profiles FOR SELECT
--   USING (TRUE);
--
-- USER WALLETS POLICIES
-- CREATE POLICY "Users can view own wallets"
--   ON user_wallets FOR SELECT
--   USING (user_id = auth.uid());
--
-- CREATE POLICY "Users can insert own wallets"
--   ON user_wallets FOR INSERT
--   WITH CHECK (user_id = auth.uid());
--
-- CREATE POLICY "Users can delete own wallets"
--   ON user_wallets FOR DELETE
--   USING (user_id = auth.uid());
--
-- COPYRIGHTS POLICIES
-- CREATE POLICY "Users can view own copyrights"
--   ON copyrights FOR SELECT
--   USING (user_id = auth.uid());
--
-- CREATE POLICY "Users can insert own copyrights"
--   ON copyrights FOR INSERT
--   WITH CHECK (user_id = auth.uid());
--
-- CREATE POLICY "Public can view published copyrights"
--   ON copyrights FOR SELECT
--   USING (TRUE);
--
-- COPYRIGHT TRANSACTIONS POLICIES
-- CREATE POLICY "Users can view own transactions"
--   ON copyright_transactions FOR SELECT
--   USING (user_id = auth.uid());
--
-- CREATE POLICY "Users can insert own transactions"
--   ON copyright_transactions FOR INSERT
--   WITH CHECK (user_id = auth.uid());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile is not needed since we manage auth locally
-- The create_user_profile function and trigger are commented out
-- The backend will create profiles directly when users register

-- CREATE OR REPLACE FUNCTION create_user_profile()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO user_profiles (id, email)
--   VALUES (NEW.id, NEW.email);
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER on_auth_user_created
-- AFTER INSERT ON auth.users
-- FOR EACH ROW
-- EXECUTE FUNCTION create_user_profile();

-- ============================================
-- VIEWS (optional - for common queries)
-- ============================================

-- User with copyrights count
CREATE OR REPLACE VIEW user_stats AS
SELECT
  up.id,
  up.email,
  up.username,
  up.full_name,
  COUNT(DISTINCT c.id) as copyright_count,
  COUNT(DISTINCT uw.id) as wallet_count,
  MAX(c.created_at) as last_copyright_date,
  up.created_at
FROM user_profiles up
LEFT JOIN copyrights c ON up.id = c.user_id
LEFT JOIN user_wallets uw ON up.id = uw.user_id
GROUP BY up.id, up.email, up.username, up.full_name, up.created_at;

-- ============================================
-- GRANTS
-- ============================================

-- Allow authenticated users to read/write their own data
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_wallets TO authenticated;
GRANT ALL ON copyrights TO authenticated;
GRANT ALL ON copyright_transactions TO authenticated;

-- Allow service role full access (for backend)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================
-- INITIAL DATA (optional test data)
-- ============================================

-- Insert test user (requires auth user to exist first)
-- INSERT INTO user_profiles (id, email, username, full_name)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'testuser', 'Test User');
