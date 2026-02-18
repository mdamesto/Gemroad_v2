-- Désactiver l'ancien "Faction Booster" générique
UPDATE booster_types SET is_active = false WHERE id = 'b2000000-0000-0000-0000-000000000003';

-- Ajouter 4 boosters de faction
INSERT INTO booster_types (id, name, description, cards_count, price_gems, price_cents, drop_rates, image_url, faction_filter, guaranteed_rarity, is_active) VALUES
  ('b2000000-0000-0000-0000-000000000010', 'Booster Dome Dwellers', 'Uniquement des cartes de la faction Dome Dwellers.', 5, 150, NULL,
    '{"common":0.40,"uncommon":0.30,"rare":0.18,"epic":0.09,"legendary":0.03}',
    NULL, 'dome_dwellers', 'uncommon', true),
  ('b2000000-0000-0000-0000-000000000011', 'Booster Underground Resistance', 'Uniquement des cartes de la faction Underground Resistance.', 5, 150, NULL,
    '{"common":0.40,"uncommon":0.30,"rare":0.18,"epic":0.09,"legendary":0.03}',
    NULL, 'underground_resistance', 'uncommon', true),
  ('b2000000-0000-0000-0000-000000000012', 'Booster Surface Survivors', 'Uniquement des cartes de la faction Surface Survivors.', 5, 150, NULL,
    '{"common":0.40,"uncommon":0.30,"rare":0.18,"epic":0.09,"legendary":0.03}',
    NULL, 'surface_survivors', 'uncommon', true),
  ('b2000000-0000-0000-0000-000000000013', 'Booster Tech Scavengers', 'Uniquement des cartes de la faction Tech Scavengers.', 5, 150, NULL,
    '{"common":0.40,"uncommon":0.30,"rare":0.18,"epic":0.09,"legendary":0.03}',
    NULL, 'tech_scavengers', 'uncommon', true);
