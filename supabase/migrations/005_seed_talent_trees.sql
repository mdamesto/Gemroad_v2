-- ===========================================================
-- Migration 005: Seed Talent Trees
-- 3 branches with 5 talents each
-- ===========================================================

-- Branch 1: Booster Master
INSERT INTO talent_trees (id, name, description, faction)
VALUES ('b1000000-0000-0000-0000-000000000001', 'Booster Master', 'Améliore tes boosters et augmente tes chances de cartes rares.', 'all')
ON CONFLICT (id) DO NOTHING;

INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
('t1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Oeil du Collectionneur', '+3% chance de rare dans les boosters', 1, 1, 'drop_rate_bonus', '{"rarity": "rare", "bonus": 0.03}', NULL),
('t1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Chance Dorée', '+2% chance d''épique dans les boosters', 2, 1, 'drop_rate_bonus', '{"rarity": "epic", "bonus": 0.02}', 't1000000-0000-0000-0000-000000000001'),
('t1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'Instinct Légendaire', '+1% chance de légendaire dans les boosters', 3, 2, 'drop_rate_bonus', '{"rarity": "legendary", "bonus": 0.01}', 't1000000-0000-0000-0000-000000000002'),
('t1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'Booster Étendu', '+1 carte par booster ouvert', 4, 2, 'extra_cards', '{"count": 1}', 't1000000-0000-0000-0000-000000000003'),
('t1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', 'Maître des Boosters', 'Garantit au minimum une rare dans chaque booster', 5, 3, 'guaranteed_rarity', '{"min_rarity": "rare"}', 't1000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;

-- Branch 2: Collector
INSERT INTO talent_trees (id, name, description, faction)
VALUES ('b1000000-0000-0000-0000-000000000002', 'Collector', 'Bonus de collection et de progression.', 'all')
ON CONFLICT (id) DO NOTHING;

INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
('t2000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Apprenti Chercheur', '+10% XP gagnée', 1, 1, 'xp_bonus', '{"bonus": 0.10}', NULL),
('t2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'Catalogue Mental', 'Voir les cartes manquantes dans les séries', 2, 1, 'reveal_missing', '{"enabled": true}', 't2000000-0000-0000-0000-000000000001'),
('t2000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'Collectionneur Acharné', '+25% XP pour les nouvelles cartes', 3, 2, 'new_card_xp_bonus', '{"bonus": 0.25}', 't2000000-0000-0000-0000-000000000002'),
('t2000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'Expert en Séries', '+500 gems bonus par série complétée', 4, 2, 'series_bonus_gems', '{"bonus": 500}', 't2000000-0000-0000-0000-000000000003'),
('t2000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', 'Archiviste Suprême', 'Double les récompenses d''achievements', 5, 3, 'achievement_reward_multiplier', '{"multiplier": 2}', 't2000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;

-- Branch 3: Fortune
INSERT INTO talent_trees (id, name, description, faction)
VALUES ('b1000000-0000-0000-0000-000000000003', 'Fortune', 'Bonus économiques et réductions.', 'all')
ON CONFLICT (id) DO NOTHING;

INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
('t3000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', 'Poches Profondes', '+50 gems bonus par récompense quotidienne', 1, 1, 'daily_bonus_gems', '{"bonus": 50}', NULL),
('t3000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'Négociateur', '-10% prix des boosters classiques', 2, 1, 'booster_discount', '{"discount": 0.10, "type": "classic"}', 't3000000-0000-0000-0000-000000000001'),
('t3000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'Marchand Aguerri', '-15% prix de tous les boosters', 3, 2, 'booster_discount', '{"discount": 0.15, "type": "all"}', 't3000000-0000-0000-0000-000000000002'),
('t3000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003', 'Investisseur', '+100 gems bonus par série complétée', 4, 2, 'series_bonus_gems', '{"bonus": 100}', 't3000000-0000-0000-0000-000000000003'),
('t3000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 'Magnat des Gemmes', '+1 booster gratuit par jour', 5, 3, 'extra_free_booster', '{"count": 1}', 't3000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;
