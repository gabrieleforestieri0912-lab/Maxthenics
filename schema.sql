-- ============================================
-- Maxthenics Database Schema (Supabase/PostgreSQL)
-- Esegui questo script nello SQL Editor di Supabase
-- ============================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS users;

-- ============================================
-- Users table
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  avatar TEXT,
  provider TEXT NOT NULL DEFAULT 'local',
  google_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free',
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  purchases JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Programs table
-- ============================================
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image TEXT,
  stripe_price_id TEXT,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Chats table
-- ============================================
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guest_id TEXT,
  title TEXT NOT NULL DEFAULT 'Nuova Chat',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);

CREATE INDEX idx_programs_user_id ON programs(user_id);
CREATE INDEX idx_programs_level ON programs(level);

CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_guest_id ON chats(guest_id);
CREATE INDEX idx_chats_updated_at ON chats(updated_at DESC);
