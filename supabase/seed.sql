-- ============================================
-- GemRoad - Seed Data
-- ============================================

-- Series
INSERT INTO series (id, name, description, total_cards, reward_type, reward_desc, image_url) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Ruines de Néon', 'Les vestiges lumineux d''une civilisation perdue dans les néons brisés.', 8, 'gem_ruby', 'Rubis véritable taillé à la main', '/images/gems/ruby.png'),
  ('a1000000-0000-0000-0000-000000000002', 'Désert de Cendres', 'Les terres brûlées où seuls les plus forts survivent.', 6, 'gem_emerald', 'Émeraude naturelle polie', '/images/gems/emerald.png'),
  ('a1000000-0000-0000-0000-000000000003', 'Océan Toxique', 'Les profondeurs empoisonnées abritent des créatures mutantes.', 10, 'gem_sapphire', 'Saphir bleu certifié', '/images/gems/sapphire.png');

-- Cards - Ruines de Néon
INSERT INTO cards (name, description, image_url, rarity, series_id, attack, defense, lore) VALUES
  ('Éclaireur Néon', 'Un survivant qui maîtrise la lumière brisée.', '/images/cards/eclaireur-neon.png', 'common', 'a1000000-0000-0000-0000-000000000001', 3, 2, 'Dans les ruines, la lumière est à la fois un allié et un danger.'),
  ('Sentinelle Rouillée', 'Un robot gardien encore fonctionnel.', '/images/cards/sentinelle-rouillee.png', 'common', 'a1000000-0000-0000-0000-000000000001', 2, 4, 'Programmé pour protéger un monde qui n''existe plus.'),
  ('Chasseur de Fragments', 'Il traque les éclats de technologie ancienne.', '/images/cards/chasseur-fragments.png', 'uncommon', 'a1000000-0000-0000-0000-000000000001', 4, 3, 'Chaque fragment raconte une histoire d''avant la chute.'),
  ('Marchande d''Ombres', 'Elle commerce dans les recoins sombres des ruines.', '/images/cards/marchande-ombres.png', 'uncommon', 'a1000000-0000-0000-0000-000000000001', 3, 3, 'Son prix ? Ce que vous avez de plus précieux.'),
  ('Golem de Câbles', 'Une masse de câbles animée par une énergie inconnue.', '/images/cards/golem-cables.png', 'rare', 'a1000000-0000-0000-0000-000000000001', 5, 5, 'Né du chaos électrique des centrales détruites.'),
  ('Spectre Holographique', 'L''écho numérique d''un ancien dirigeant.', '/images/cards/spectre-holographique.png', 'rare', 'a1000000-0000-0000-0000-000000000001', 4, 6, 'Son discours tourne en boucle depuis 200 ans.'),
  ('Archonte du Néon', 'Le maître des lumières mourantes.', '/images/cards/archonte-neon.png', 'epic', 'a1000000-0000-0000-0000-000000000001', 7, 5, 'Il contrôle chaque photon dans son domaine dévasté.'),
  ('Titan Chrome', 'L''ultime gardien des Ruines de Néon.', '/images/cards/titan-chrome.png', 'legendary', 'a1000000-0000-0000-0000-000000000001', 9, 8, 'On dit qu''il est le dernier projet d''une IA folle.');

-- Cards - Désert de Cendres
INSERT INTO cards (name, description, image_url, rarity, series_id, attack, defense, lore) VALUES
  ('Nomade des Cendres', 'Un voyageur solitaire du désert gris.', '/images/cards/nomade-cendres.png', 'common', 'a1000000-0000-0000-0000-000000000002', 2, 3, 'Il marche sans fin, cherchant un horizon qui n''existe pas.'),
  ('Scorpion Mutant', 'Une créature adaptée à la désolation.', '/images/cards/scorpion-mutant.png', 'common', 'a1000000-0000-0000-0000-000000000002', 4, 2, 'Son venin peut dissoudre l''acier.'),
  ('Prophète du Sable', 'Il prétend voir l''avenir dans les tempêtes.', '/images/cards/prophete-sable.png', 'uncommon', 'a1000000-0000-0000-0000-000000000002', 3, 4, 'Ses prophéties sont terrifiantes... et précises.'),
  ('Colosse de Rouille', 'Un véhicule de guerre transformé en forteresse mobile.', '/images/cards/colosse-rouille.png', 'rare', 'a1000000-0000-0000-0000-000000000002', 6, 6, 'Il avance sans carburant, mû par une volonté propre.'),
  ('Reine des Tempêtes', 'Elle commande les vents de cendres.', '/images/cards/reine-tempetes.png', 'epic', 'a1000000-0000-0000-0000-000000000002', 7, 4, 'Quand elle danse, le désert hurle.'),
  ('Léviathan Enseveli', 'Une créature titanesque endormie sous les cendres.', '/images/cards/leviathan-enseveli.png', 'legendary', 'a1000000-0000-0000-0000-000000000002', 10, 7, 'Son réveil signifierait la fin du peu qu''il reste.');

-- Cards - Océan Toxique
INSERT INTO cards (name, description, image_url, rarity, series_id, attack, defense, lore) VALUES
  ('Plongeur Aveugle', 'Il navigue par le son dans les eaux opaques.', '/images/cards/plongeur-aveugle.png', 'common', 'a1000000-0000-0000-0000-000000000003', 2, 2, 'Ses yeux ont été pris par l''acide il y a longtemps.'),
  ('Méduse Radioactive', 'Belle et mortelle, elle illumine les abysses.', '/images/cards/meduse-radioactive.png', 'common', 'a1000000-0000-0000-0000-000000000003', 3, 1, 'Sa lumière attire... et consume.'),
  ('Pirate des Récifs', 'Il pille les épaves de l''ancien monde.', '/images/cards/pirate-recifs.png', 'common', 'a1000000-0000-0000-0000-000000000003', 3, 3, 'Chaque plongée peut être la dernière.'),
  ('Sirène Corrompue', 'Mi-humaine, mi-créature des profondeurs.', '/images/cards/sirene-corrompue.png', 'uncommon', 'a1000000-0000-0000-0000-000000000003', 4, 3, 'Son chant promet le salut mais apporte la folie.'),
  ('Requin Blindé', 'Un prédateur recouvert de plaques métalliques.', '/images/cards/requin-blinde.png', 'uncommon', 'a1000000-0000-0000-0000-000000000003', 5, 4, 'Résultat d''expériences militaires oubliées.'),
  ('Kraken de Pétrole', 'Il vit dans les nappes de pétrole toxique.', '/images/cards/kraken-petrole.png', 'rare', 'a1000000-0000-0000-0000-000000000003', 6, 5, 'Ses tentacules s''étendent sur des kilomètres.'),
  ('Amiral Fantôme', 'Le capitaine d''une flotte engloutie.', '/images/cards/amiral-fantome.png', 'rare', 'a1000000-0000-0000-0000-000000000003', 5, 6, 'Il commande des navires que personne ne peut voir.'),
  ('Hydre Abyssale', 'Chaque tête coupée en fait naître deux.', '/images/cards/hydre-abyssale.png', 'epic', 'a1000000-0000-0000-0000-000000000003', 8, 5, 'Les profondeurs lui appartiennent.'),
  ('Poseidon Corrompu', 'L''ancien dieu des mers, transformé par la pollution.', '/images/cards/poseidon-corrompu.png', 'epic', 'a1000000-0000-0000-0000-000000000003', 7, 7, 'Il ne protège plus les océans, il les punit.'),
  ('Abomination des Abysses', 'La chose qui vit tout en bas.', '/images/cards/abomination-abysses.png', 'legendary', 'a1000000-0000-0000-0000-000000000003', 10, 9, 'Personne ne l''a vue et n''a survécu pour la décrire.');

-- Booster Types
INSERT INTO booster_types (id, name, description, cards_count, price_gems, price_cents, drop_rates, image_url) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Booster Standard', 'Un booster contenant 5 cartes avec des chances standard.', 5, 100, NULL, '{"common":0.50,"uncommon":0.25,"rare":0.15,"epic":0.08,"legendary":0.02}', '/images/ui/booster-standard.png'),
  ('b1000000-0000-0000-0000-000000000002', 'Booster Premium', 'Un booster amélioré avec de meilleures chances pour les cartes rares.', 5, 250, 299, '{"common":0.30,"uncommon":0.30,"rare":0.22,"epic":0.13,"legendary":0.05}', '/images/ui/booster-premium.png'),
  ('b1000000-0000-0000-0000-000000000003', 'Booster Légendaire', 'Le meilleur booster avec une carte rare garantie et des chances légendaires accrues.', 7, 500, 599, '{"common":0.15,"uncommon":0.25,"rare":0.30,"epic":0.20,"legendary":0.10}', '/images/ui/booster-legendary.png');

-- Achievements
INSERT INTO achievements (name, description, icon_url, condition_type, condition_value, reward_gems, reward_xp) VALUES
  ('Premier Pas', 'Ouvrir votre premier booster.', '/images/ui/achievement-first.png', 'boosters_opened', 1, 50, 10),
  ('Collectionneur Novice', 'Collecter 10 cartes différentes.', '/images/ui/achievement-collector.png', 'cards_collected', 10, 100, 25),
  ('Collectionneur Expert', 'Collecter 50 cartes différentes.', '/images/ui/achievement-expert.png', 'cards_collected', 50, 500, 100),
  ('Maître Collectionneur', 'Collecter toutes les cartes du jeu.', '/images/ui/achievement-master.png', 'cards_collected', 24, 2000, 500),
  ('Chasseur de Boosters', 'Ouvrir 10 boosters.', '/images/ui/achievement-hunter.png', 'boosters_opened', 10, 200, 50),
  ('Accro aux Boosters', 'Ouvrir 50 boosters.', '/images/ui/achievement-addict.png', 'boosters_opened', 50, 1000, 200),
  ('Première Série', 'Compléter votre première série.', '/images/ui/achievement-series.png', 'series_completed', 1, 500, 100),
  ('Chasseur de Raretés', 'Obtenir 5 cartes épiques ou légendaires.', '/images/ui/achievement-rarity.png', 'rarity_collected', 5, 300, 75),
  ('Légende Vivante', 'Obtenir toutes les cartes légendaires.', '/images/ui/achievement-legend.png', 'rarity_collected', 3, 3000, 1000);
