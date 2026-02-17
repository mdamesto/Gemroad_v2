-- ============================================
-- GemRoad - Migration 003: Seed Data (Types, Factions, Talents)
-- ============================================

-- ============================================
-- CLEAN OLD DATA
-- ============================================

DELETE FROM user_talents;
DELETE FROM talents;
DELETE FROM talent_trees;
DELETE FROM user_achievements;
DELETE FROM user_series_progress;
DELETE FROM user_cards;
DELETE FROM user_boosters;
DELETE FROM transactions;
DELETE FROM cards;
DELETE FROM series;
DELETE FROM booster_types;
DELETE FROM achievements;

-- ============================================
-- SERIES (3)
-- ============================================

INSERT INTO series (id, name, description, total_cards, reward_type, reward_desc, image_url) VALUES
  ('a2000000-0000-0000-0000-000000000001', 'Complete Dome Dwellers', 'Collect all Dome Dwellers faction cards to unlock a rare gem.', 4, 'gem_ruby', 'Rubis de Protection du Dôme', '/images/gems/ruby.png'),
  ('a2000000-0000-0000-0000-000000000002', 'All Legendary Artifacts', 'Gather every legendary artifact in the wasteland.', 3, 'gem_emerald', 'Émeraude de l''Ancien Monde', '/images/gems/emerald.png'),
  ('a2000000-0000-0000-0000-000000000003', 'Surface Survivors Collection', 'Unite the brave souls who dare to live on the surface.', 4, 'gem_sapphire', 'Saphir de Survie', '/images/gems/sapphire.png');

-- ============================================
-- CARDS (14 cards across 4 factions and 4 types)
-- ============================================

-- Dome Dwellers (4 cards) - series 1
INSERT INTO cards (name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('Dome Guardian', 'Elite soldier protecting the last enclosed city.', '/images/cards/dome-guardian.png', 'common', 'a2000000-0000-0000-0000-000000000001', 3, 5, 'The dome is all that stands between civilization and extinction.', 'character', 'dome_dwellers'),
  ('Atmospheric Purifier', 'Ancient machine that keeps the dome air breathable.', '/images/cards/atmospheric-purifier.png', 'uncommon', 'a2000000-0000-0000-0000-000000000001', 0, 4, 'Without it, the dome becomes a tomb within hours.', 'artifact', 'dome_dwellers'),
  ('Council Chamber', 'Where the Dome elders make decisions that shape the last city.', '/images/cards/council-chamber.png', 'rare', 'a2000000-0000-0000-0000-000000000001', 1, 7, 'Every voice echoes in these halls, but only power speaks.', 'location', 'dome_dwellers'),
  ('Dome Breach Protocol', 'Emergency response when the barrier is compromised.', '/images/cards/dome-breach-protocol.png', 'epic', 'a2000000-0000-0000-0000-000000000001', 6, 3, 'Seal the breach or lose everything — there is no middle ground.', 'event', 'dome_dwellers');

-- Underground Resistance (3 cards)
INSERT INTO cards (name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('Tunnel Rat', 'A nimble scout who knows every passage beneath the ruins.', '/images/cards/tunnel-rat.png', 'common', NULL, 4, 2, 'In the dark below, speed is the only armor.', 'character', 'underground_resistance'),
  ('Signal Jammer', 'Device that blocks dome surveillance in rebel territory.', '/images/cards/signal-jammer.png', 'rare', NULL, 2, 3, 'Silence is the first weapon of rebellion.', 'artifact', 'underground_resistance'),
  ('The Deep Warren', 'A hidden rebel base carved into old metro tunnels.', '/images/cards/deep-warren.png', 'epic', NULL, 3, 8, 'Maps to the Warren are memorized, never written.', 'location', 'underground_resistance');

-- Surface Survivors (4 cards) - series 3
INSERT INTO cards (name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('Wasteland Nomad', 'A lone wanderer adapted to the toxic surface.', '/images/cards/wasteland-nomad.png', 'common', 'a2000000-0000-0000-0000-000000000003', 3, 3, 'The surface kills the weak. He is still here.', 'character', 'surface_survivors'),
  ('Rad-Storm Warning', 'A deadly radiation storm sweeps the wasteland.', '/images/cards/rad-storm-warning.png', 'uncommon', 'a2000000-0000-0000-0000-000000000003', 5, 0, 'When the sky turns green, even the brave hide.', 'event', 'surface_survivors'),
  ('Scrapyard Fortress', 'A makeshift stronghold built from wreckage and willpower.', '/images/cards/scrapyard-fortress.png', 'rare', 'a2000000-0000-0000-0000-000000000003', 2, 6, 'Ugly, loud, and standing — just like its builders.', 'location', 'surface_survivors'),
  ('Mutant Warlord', 'A fearsome leader whose mutations grant incredible power.', '/images/cards/mutant-warlord.png', 'legendary', 'a2000000-0000-0000-0000-000000000003', 9, 7, 'He did not choose mutation. Mutation chose him.', 'character', 'surface_survivors');

-- Tech Scavengers (3 cards) - includes legendary artifacts for series 2
INSERT INTO cards (id, name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Chrome Hacker', 'A tech genius who can crack any pre-war system.', '/images/cards/chrome-hacker.png', 'uncommon', NULL, 4, 2, 'Every firewall is a door if you know the code.', 'character', 'tech_scavengers'),
  ('c1000000-0000-0000-0000-000000000002', 'Quantum Core', 'A mythical power source from the old world.', '/images/cards/quantum-core.png', 'legendary', 'a2000000-0000-0000-0000-000000000002', 8, 6, 'Infinite energy, infinite danger.', 'artifact', 'tech_scavengers'),
  ('c1000000-0000-0000-0000-000000000003', 'Neural Uplink Helm', 'Helmet that connects directly to ancient networks.', '/images/cards/neural-uplink-helm.png', 'legendary', 'a2000000-0000-0000-0000-000000000002', 7, 5, 'The voices of a billion dead users whisper through it.', 'artifact', 'tech_scavengers');

-- Additional legendary artifact for series 2 (cross-faction)
INSERT INTO cards (name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('Doomsday Codex', 'The forbidden record of how the world ended.', '/images/cards/doomsday-codex.png', 'legendary', 'a2000000-0000-0000-0000-000000000002', 6, 9, 'Knowledge is power. This knowledge is annihilation.', 'artifact', 'underground_resistance');

-- ============================================
-- BOOSTER TYPES (4)
-- ============================================

INSERT INTO booster_types (id, name, description, cards_count, price_gems, price_cents, drop_rates, image_url, faction_filter, guaranteed_rarity) VALUES
  ('b2000000-0000-0000-0000-000000000001', 'Classic Booster', '5 common, 2 uncommon, 1 rare or better.', 8, 100, NULL,
    '{"common":0.50,"uncommon":0.25,"rare":0.15,"epic":0.08,"legendary":0.02}',
    '/images/ui/booster-standard.png', NULL, 'rare'),
  ('b2000000-0000-0000-0000-000000000002', 'Premium Booster', 'Guaranteed 3 rare or better cards.', 6, 300, 399,
    '{"common":0.20,"uncommon":0.25,"rare":0.30,"epic":0.18,"legendary":0.07}',
    '/images/ui/booster-premium.png', NULL, 'rare'),
  ('b2000000-0000-0000-0000-000000000003', 'Faction Booster', 'Cards from a specific faction. Choose your allegiance.', 5, 200, 249,
    '{"common":0.40,"uncommon":0.30,"rare":0.18,"epic":0.09,"legendary":0.03}',
    '/images/ui/booster-faction.png', NULL, NULL),
  ('b2000000-0000-0000-0000-000000000004', 'Legendary Booster', 'The ultimate booster with top-tier drop rates.', 7, 500, 599,
    '{"common":0.10,"uncommon":0.20,"rare":0.30,"epic":0.25,"legendary":0.15}',
    '/images/ui/booster-legendary.png', NULL, 'epic');

-- ============================================
-- ACHIEVEMENTS (5)
-- ============================================

INSERT INTO achievements (name, description, icon_url, condition_type, condition_value, reward_gems, reward_xp) VALUES
  ('Booster Enthusiast', 'Open 10 boosters.', '/images/ui/achievement-hunter.png', 'boosters_opened', 10, 200, 50),
  ('Dedicated Player', 'Login 5 days in a row.', '/images/ui/achievement-streak.png', 'login_streak', 5, 150, 40),
  ('Card Hoarder', 'Collect 50 cards.', '/images/ui/achievement-expert.png', 'cards_collected', 50, 500, 100),
  ('Series Completer', 'Complete a series.', '/images/ui/achievement-series.png', 'series_completed', 1, 500, 100),
  ('Faction Diplomat', 'Collect at least one card from every faction.', '/images/ui/achievement-factions.png', 'all_factions', 4, 300, 75);

-- ============================================
-- TALENT TREES (4, one per faction)
-- ============================================

INSERT INTO talent_trees (id, name, description, faction) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Dome Engineering', 'Master the technology that keeps the dome alive.', 'dome_dwellers'),
  ('d1000000-0000-0000-0000-000000000002', 'Shadow Network', 'Expand your influence through the underground tunnels.', 'underground_resistance'),
  ('d1000000-0000-0000-0000-000000000003', 'Wasteland Survival', 'Harden yourself against the dangers of the surface.', 'surface_survivors'),
  ('d1000000-0000-0000-0000-000000000004', 'Salvage Mastery', 'Unlock the secrets of pre-war technology.', 'tech_scavengers');

-- ============================================
-- TALENTS (3-4 per tree)
-- ============================================

-- Dome Engineering talents
INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
  ('ea100000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Reinforced Shields', 'Dome Dwellers cards gain +1 defense.', 1, 1, 'stat_boost', '{"stat":"defense","value":1,"faction":"dome_dwellers"}', NULL),
  ('ea100000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'Efficient Recycling', 'Earn 10% more gems from duplicate cards.', 2, 2, 'gem_bonus', '{"bonus_percent":10}', 'ea100000-0000-0000-0000-000000000001'),
  ('ea100000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'Dome Authority', 'Unlock exclusive Dome Dwellers booster discounts.', 3, 3, 'discount', '{"discount_percent":15,"target":"faction_booster"}', 'ea100000-0000-0000-0000-000000000002');

-- Shadow Network talents
INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
  ('ea200000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002', 'Covert Operations', 'Underground Resistance cards gain +1 attack.', 1, 1, 'stat_boost', '{"stat":"attack","value":1,"faction":"underground_resistance"}', NULL),
  ('ea200000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'Intel Network', 'See one extra card preview before opening a booster.', 2, 2, 'booster_preview', '{"extra_previews":1}', 'ea200000-0000-0000-0000-000000000001'),
  ('ea200000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002', 'Sabotage', 'Increased chance of rare+ cards from non-faction boosters.', 3, 3, 'drop_rate_boost', '{"rarity_boost":0.05}', 'ea200000-0000-0000-0000-000000000002');

-- Wasteland Survival talents
INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
  ('ea300000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000003', 'Thick Skin', 'Surface Survivors cards gain +1 defense.', 1, 1, 'stat_boost', '{"stat":"defense","value":1,"faction":"surface_survivors"}', NULL),
  ('ea300000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000003', 'Scavenger Instinct', 'Find bonus gems when opening boosters.', 2, 2, 'gem_on_open', '{"gems":5}', 'ea300000-0000-0000-0000-000000000001'),
  ('ea300000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003', 'Rad Immunity', 'Earn double XP from Surface Survivors cards.', 3, 3, 'xp_boost', '{"multiplier":2,"faction":"surface_survivors"}', 'ea300000-0000-0000-0000-000000000002'),
  ('ea300000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000003', 'Warlord''s Blessing', 'Unlock exclusive Surface Survivors legendary quests.', 4, 4, 'unlock_quest', '{"quest_type":"legendary"}', 'ea300000-0000-0000-0000-000000000003');

-- Salvage Mastery talents
INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
  ('ea400000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000004', 'Tech Analysis', 'Tech Scavengers cards gain +1 attack.', 1, 1, 'stat_boost', '{"stat":"attack","value":1,"faction":"tech_scavengers"}', NULL),
  ('ea400000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000004', 'Reverse Engineer', 'Get an extra card when opening boosters.', 2, 2, 'extra_card', '{"extra_cards":1}', 'ea400000-0000-0000-0000-000000000001'),
  ('ea400000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000004', 'Quantum Decryption', 'Increased legendary drop rate for artifact cards.', 3, 3, 'drop_rate_boost', '{"rarity_boost":0.03,"type":"artifact"}', 'ea400000-0000-0000-0000-000000000002');
