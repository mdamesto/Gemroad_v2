-- ============================================
-- GemRoad - Migration 002: Types, Factions, Talents
-- ============================================

-- ============================================
-- ALTER EXISTING TABLES
-- ============================================

-- Add type and faction columns to cards
ALTER TABLE cards ADD COLUMN type TEXT NOT NULL DEFAULT 'character'
  CHECK (type IN ('character', 'artifact', 'location', 'event'));

ALTER TABLE cards ADD COLUMN faction TEXT
  CHECK (faction IN ('dome_dwellers', 'underground_resistance', 'surface_survivors', 'tech_scavengers'));

-- Add talent_points to profiles
ALTER TABLE profiles ADD COLUMN talent_points INTEGER NOT NULL DEFAULT 0;

-- Add faction_filter and guaranteed_rarity to booster_types
ALTER TABLE booster_types ADD COLUMN faction_filter TEXT
  CHECK (faction_filter IS NULL OR faction_filter IN ('dome_dwellers', 'underground_resistance', 'surface_survivors', 'tech_scavengers'));

ALTER TABLE booster_types ADD COLUMN guaranteed_rarity TEXT
  CHECK (guaranteed_rarity IS NULL OR guaranteed_rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary'));

-- ============================================
-- NEW TABLES
-- ============================================

-- Talent Trees (one per faction)
CREATE TABLE talent_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  faction TEXT NOT NULL CHECK (faction IN ('dome_dwellers', 'underground_resistance', 'surface_survivors', 'tech_scavengers')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Talents (individual nodes in a talent tree)
CREATE TABLE talents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_tree_id UUID NOT NULL REFERENCES talent_trees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tier INTEGER NOT NULL DEFAULT 1,
  cost INTEGER NOT NULL DEFAULT 1,
  effect_type TEXT NOT NULL,
  effect_value JSONB NOT NULL DEFAULT '{}',
  prerequisite_talent_id UUID REFERENCES talents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Talents (which talents a user has unlocked)
CREATE TABLE user_talents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, talent_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_cards_type ON cards(type);
CREATE INDEX idx_cards_faction ON cards(faction);
CREATE INDEX idx_talents_tree ON talents(talent_tree_id);
CREATE INDEX idx_user_talents_user ON user_talents(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE talent_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_talents ENABLE ROW LEVEL SECURITY;

-- Talent trees and talents: readable by everyone
CREATE POLICY "Talent trees are viewable by everyone"
  ON talent_trees FOR SELECT USING (true);

CREATE POLICY "Admins can manage talent trees"
  ON talent_trees FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Talents are viewable by everyone"
  ON talents FOR SELECT USING (true);

CREATE POLICY "Admins can manage talents"
  ON talents FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- User talents: users can only see their own
CREATE POLICY "Users can view own talents"
  ON user_talents FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage user talents"
  ON user_talents FOR ALL USING (auth.role() = 'service_role');
