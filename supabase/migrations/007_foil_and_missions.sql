-- Feature 9: Foil cards
ALTER TABLE user_cards ADD COLUMN IF NOT EXISTS is_foil BOOLEAN DEFAULT false;

-- Feature 8: Missions
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value INT NOT NULL,
  reward_gems INT DEFAULT 0,
  reward_xp INT DEFAULT 0,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  mission_id UUID NOT NULL REFERENCES missions(id),
  progress INT DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  claimed BOOLEAN DEFAULT false,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Index for fast lookups on user_missions
CREATE INDEX IF NOT EXISTS idx_user_missions_user_id ON user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_expires ON user_missions(expires_at);

-- Enable RLS on new tables
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;

-- Missions are readable by all authenticated users
CREATE POLICY "Missions are viewable by authenticated users"
  ON missions FOR SELECT
  TO authenticated
  USING (true);

-- Users can only see their own user_missions
CREATE POLICY "Users can view own missions"
  ON user_missions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own missions"
  ON user_missions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missions"
  ON user_missions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
