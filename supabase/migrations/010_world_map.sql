-- 010_world_map.sql — Exploration missions per region

-- Table: exploration_missions (permanent one-shot missions tied to regions)
CREATE TABLE exploration_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL CHECK (region IN ('neon_ruins', 'ash_desert', 'toxic_ocean')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value INT NOT NULL,
  condition_faction TEXT,
  reward_gems INT DEFAULT 0,
  reward_xp INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  icon TEXT DEFAULT '🔍',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: user_exploration_progress (tracks completed missions per user)
CREATE TABLE user_exploration_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  mission_id UUID NOT NULL REFERENCES exploration_missions(id),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, mission_id)
);

-- Indexes
CREATE INDEX idx_exploration_missions_region ON exploration_missions(region);
CREATE INDEX idx_user_exploration_progress_user ON user_exploration_progress(user_id);
CREATE INDEX idx_user_exploration_progress_mission ON user_exploration_progress(mission_id);

-- RLS
ALTER TABLE exploration_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exploration_progress ENABLE ROW LEVEL SECURITY;

-- exploration_missions: public read
CREATE POLICY "exploration_missions_select" ON exploration_missions
  FOR SELECT USING (true);

-- user_exploration_progress: user-scoped
CREATE POLICY "user_exploration_progress_select" ON user_exploration_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_exploration_progress_insert" ON user_exploration_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_exploration_progress_update" ON user_exploration_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- Seed: 21 exploration missions (7 per region)
-- ============================================================

-- Ruines de Neon (tech_scavengers + underground_resistance)
INSERT INTO exploration_missions (region, title, description, condition_type, condition_value, condition_faction, reward_gems, reward_xp, sort_order, icon) VALUES
('neon_ruins', 'Premiers Pas dans les Ruines', 'Possédez 2 cartes distinctes Tech Scavengers', 'collect_faction_cards', 2, 'tech_scavengers', 30, 20, 1, '👣'),
('neon_ruins', 'Pilier du Marché Noir', 'Possédez 2 cartes distinctes Underground Resistance', 'collect_faction_cards', 2, 'underground_resistance', 30, 20, 2, '🏴'),
('neon_ruins', 'Chasseur de Technologie', 'Possédez 1 carte Rare ou mieux Tech Scavengers', 'collect_faction_rarity', 3, 'tech_scavengers', 60, 40, 3, '🔧'),
('neon_ruins', 'Approvisionneur de Néon', 'Ouvrez 3 boosters Tech Scavengers', 'open_faction_boosters', 3, 'tech_scavengers', 50, 30, 4, '📦'),
('neon_ruins', 'Archiviste des Ruines', 'Découvrez 2 entrées codex de cette région', 'discover_region_codex', 2, NULL, 80, 50, 5, '📜'),
('neon_ruins', 'Maîtrise Technologique', 'Possédez toutes les cartes Communes Tech Scavengers', 'collect_all_faction_rarity', 1, 'tech_scavengers', 100, 60, 6, '⚡'),
('neon_ruins', 'Légende du Néon', 'Complétez l''arc narratif des Ruines de Néon', 'complete_story_arc', 1, NULL, 200, 120, 7, '🏆');

-- Desert de Cendres (surface_survivors)
INSERT INTO exploration_missions (region, title, description, condition_type, condition_value, condition_faction, reward_gems, reward_xp, sort_order, icon) VALUES
('ash_desert', 'Sentier des Nomades', 'Possédez 2 cartes distinctes Surface Survivors', 'collect_faction_cards', 2, 'surface_survivors', 30, 20, 1, '🐪'),
('ash_desert', 'Survivant Endurci', 'Possédez 4 cartes distinctes Surface Survivors', 'collect_faction_cards', 4, 'surface_survivors', 50, 30, 2, '🛡️'),
('ash_desert', 'Rareté du Désert', 'Possédez 1 carte Rare ou mieux Surface Survivors', 'collect_faction_rarity', 3, 'surface_survivors', 60, 40, 3, '💎'),
('ash_desert', 'Chasseur de Tempêtes', 'Ouvrez 3 boosters Surface Survivors', 'open_faction_boosters', 3, 'surface_survivors', 50, 30, 4, '🌪️'),
('ash_desert', 'Prophéties de Sable', 'Découvrez 2 entrées codex de cette région', 'discover_region_codex', 2, NULL, 80, 50, 5, '📖'),
('ash_desert', 'Dominateur des Dunes', 'Possédez toutes les cartes Communes Surface Survivors', 'collect_all_faction_rarity', 1, 'surface_survivors', 100, 60, 6, '👑'),
('ash_desert', 'Légende du Désert', 'Complétez l''arc narratif du Désert de Cendres', 'complete_story_arc', 1, NULL, 200, 120, 7, '🏆');

-- Ocean Toxique (underground_resistance)
INSERT INTO exploration_missions (region, title, description, condition_type, condition_value, condition_faction, reward_gems, reward_xp, sort_order, icon) VALUES
('toxic_ocean', 'Plongée Initiale', 'Possédez 2 cartes distinctes Underground Resistance', 'collect_faction_cards', 2, 'underground_resistance', 30, 20, 1, '🤿'),
('toxic_ocean', 'Explorateur des Profondeurs', 'Possédez 5 cartes distinctes Underground Resistance', 'collect_faction_cards', 5, 'underground_resistance', 50, 30, 2, '🐙'),
('toxic_ocean', 'Trophée Abyssal', 'Possédez 1 carte Épique ou mieux Underground Resistance', 'collect_faction_rarity', 4, 'underground_resistance', 80, 50, 3, '🦑'),
('toxic_ocean', 'Ravitaillement Marin', 'Ouvrez 3 boosters Underground Resistance', 'open_faction_boosters', 3, 'underground_resistance', 50, 30, 4, '🚢'),
('toxic_ocean', 'Secrets des Abysses', 'Découvrez 2 entrées codex de cette région', 'discover_region_codex', 2, NULL, 80, 50, 5, '🔮'),
('toxic_ocean', 'Collection Corrompue', 'Possédez toutes les cartes Communes Underground Resistance', 'collect_all_faction_rarity', 1, 'underground_resistance', 100, 60, 6, '☠️'),
('toxic_ocean', 'Légende de l''Océan', 'Complétez l''arc narratif de l''Océan Toxique', 'complete_story_arc', 1, NULL, 200, 120, 7, '🏆');
