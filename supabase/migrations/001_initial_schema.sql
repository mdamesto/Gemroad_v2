-- ============================================
-- GemRoad - Initial Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES
-- ============================================

-- Series (collections thématiques)
CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  total_cards INTEGER NOT NULL,
  reward_type TEXT NOT NULL,
  reward_desc TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cards (catalogue)
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  series_id UUID REFERENCES series(id),
  attack INTEGER,
  defense INTEGER,
  lore TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (extension de auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  gems_balance INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booster Types
CREATE TABLE booster_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cards_count INTEGER NOT NULL DEFAULT 5,
  price_gems INTEGER NOT NULL,
  price_cents INTEGER,
  drop_rates JSONB NOT NULL DEFAULT '{"common":0.50,"uncommon":0.25,"rare":0.15,"epic":0.08,"legendary":0.02}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Cards (collection du joueur)
CREATE TABLE user_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  obtained_at TIMESTAMPTZ DEFAULT NOW(),
  obtained_from TEXT,
  UNIQUE(user_id, card_id)
);

-- User Boosters (boosters non ouverts)
CREATE TABLE user_boosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  booster_type_id UUID REFERENCES booster_types(id),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ
);

-- Achievements (définitions)
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL,
  reward_gems INTEGER NOT NULL DEFAULT 0,
  reward_xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  claimed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, achievement_id)
);

-- User Series Progress
CREATE TABLE user_series_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  series_id UUID REFERENCES series(id) ON DELETE CASCADE,
  cards_collected INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  reward_claimed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, series_id)
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Rewards
CREATE TABLE daily_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_streak INTEGER DEFAULT 1,
  gems_earned INTEGER NOT NULL,
  claimed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(user_id, claimed_at)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_cards_series ON cards(series_id);
CREATE INDEX idx_cards_rarity ON cards(rarity);
CREATE INDEX idx_user_cards_user ON user_cards(user_id);
CREATE INDEX idx_user_cards_card ON user_cards(card_id);
CREATE INDEX idx_user_boosters_user ON user_boosters(user_id);
CREATE INDEX idx_user_boosters_unopened ON user_boosters(user_id) WHERE opened_at IS NULL;
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_series_progress_user ON user_series_progress(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_daily_rewards_user ON daily_rewards(user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'player_' || LEFT(NEW.id::TEXT, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_boosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_series_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE booster_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Cards: readable by everyone
CREATE POLICY "Cards are viewable by everyone"
  ON cards FOR SELECT USING (true);

CREATE POLICY "Admins can manage cards"
  ON cards FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Series: readable by everyone
CREATE POLICY "Series are viewable by everyone"
  ON series FOR SELECT USING (true);

CREATE POLICY "Admins can manage series"
  ON series FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Booster Types: readable by everyone
CREATE POLICY "Booster types are viewable by everyone"
  ON booster_types FOR SELECT USING (true);

CREATE POLICY "Admins can manage booster types"
  ON booster_types FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Achievements: readable by everyone
CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements"
  ON achievements FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- User Cards: users can only see their own
CREATE POLICY "Users can view own cards"
  ON user_cards FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage user cards"
  ON user_cards FOR ALL USING (auth.role() = 'service_role');

-- User Boosters: users can only see their own
CREATE POLICY "Users can view own boosters"
  ON user_boosters FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage user boosters"
  ON user_boosters FOR ALL USING (auth.role() = 'service_role');

-- User Achievements: users can only see their own
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage user achievements"
  ON user_achievements FOR ALL USING (auth.role() = 'service_role');

-- User Series Progress: users can only see their own
CREATE POLICY "Users can view own series progress"
  ON user_series_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage series progress"
  ON user_series_progress FOR ALL USING (auth.role() = 'service_role');

-- Transactions: users can only see their own
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage transactions"
  ON transactions FOR ALL USING (auth.role() = 'service_role');

-- Daily Rewards: users can only see their own
CREATE POLICY "Users can view own daily rewards"
  ON daily_rewards FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage daily rewards"
  ON daily_rewards FOR ALL USING (auth.role() = 'service_role');
