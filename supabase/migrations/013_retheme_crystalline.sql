-- ============================================
-- GemRoad - Migration 013: Retheme Cristallin 2156
-- Univers cristallin complet remplaçant le thème post-apocalyptique
-- ============================================

-- ============================================
-- PHASE 1: DELETE EXISTING SEED DATA
-- Order matters due to foreign keys
-- ============================================

-- User progress tables (user data — cleared for consistency)
DELETE FROM event_participations;
DELETE FROM user_codex;
DELETE FROM user_story_progress;
DELETE FROM user_exploration_progress;
DELETE FROM user_missions;
DELETE FROM user_achievements;
DELETE FROM user_series_progress;
DELETE FROM user_cards;
DELETE FROM user_boosters;

-- Content tables
DELETE FROM event_choices;
-- Clear winning_choice_id before deleting events
UPDATE narrative_events SET winning_choice_id = NULL;
DELETE FROM narrative_events;
DELETE FROM exploration_missions;
DELETE FROM story_nodes;
DELETE FROM story_chapters;
DELETE FROM story_arcs;

-- Talents (must delete user_talents first if exists)
DO $$ BEGIN
  DELETE FROM user_talents;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
DELETE FROM talents;
DELETE FROM talent_trees;

-- Cards and related
DELETE FROM cards;
DELETE FROM booster_types;
DELETE FROM series;
DELETE FROM achievements;
DELETE FROM factions;

-- ============================================
-- PHASE 2: INSERT NEW SEED DATA
-- ============================================

-- ============================================
-- FACTIONS (4)
-- ============================================

INSERT INTO factions (slug, name, description, lore, motto, leader_name, leader_title, color, icon, sort_order) VALUES
  ('dome_dwellers', 'Le Consortium',
   'Conglomérat industriel qui contrôle l''extraction et la commercialisation des cristaux. Élites corporatistes dans des complexes blindés.',
   'Quand les premières géodes furent découvertes à Madagascar en 2156, ce fut le Consortium Aldemar — alors simple conglomérat minier — qui obtint les droits d''exploitation. En moins d''une décennie, ils ont bâti un empire sur les cristaux, contrôlant l''extraction, le raffinage et la distribution de l''énergie cristalline. Depuis leurs complexes fortifiés, les dirigeants du Consortium voient le réseau cristallin comme une ressource à exploiter, pas un mystère à comprendre. Chaque cristal a un prix, et le Consortium fixe ce prix.',
   'Le cristal obéit à celui qui le possède.',
   'PDG Aldemar', 'Directeur Suprême du Consortium',
   '#3B82F6', '', 0),

  ('underground_resistance', 'Les Profonds',
   'Mineurs rebelles qui ont découvert le réseau cristallin en premier. Ils vivent dans les galeries souterraines et défendent l''accès libre au réseau.',
   'Nyra était une simple mineuse quand sa pioche a fendu la première géode. Ce qu''elle a vu à l''intérieur — un réseau de filaments cristallins pulsant de lumière — a changé sa vie. Les Profonds sont les descendants de ces premiers mineurs, ceux qui ont découvert le réseau avant que le Consortium ne s''en empare. Vivant dans les galeries souterraines qu''ils ont creusées de leurs mains, ils considèrent les cristaux comme un bien commun, pas une marchandise. Leur connaissance intime du sous-sol en fait les meilleurs explorateurs — et les adversaires les plus redoutables du Consortium.',
   'Nous sommes nés dans la roche, nous vivons dans le cristal.',
   'La Doyenne Nyra', 'Voix des Galeries',
   '#DC2626', '', 1),

  ('surface_survivors', 'Les Gardiens du Réseau',
   'Scientifiques dissidents et chercheurs qui veulent étudier et protéger le réseau cristallin. Nomades entre les gisements.',
   'Quand la Professeure Aïcha a découvert que les cristaux formaient un réseau d''information planétaire, le monde scientifique a explosé. Mais le Consortium a tenté d''étouffer la découverte, craignant que la vérité ne menace son monopole. Aïcha et ses collègues ont fondé les Gardiens du Réseau — un mouvement de scientifiques, géologues et chercheurs déterminés à étudier le réseau cristallin, à le protéger de l''exploitation abusive, et à comprendre son véritable message. Nomades entre les gisements, ils cartographient le réseau avec une précision obsessionnelle.',
   'Comprendre, protéger, transmettre.',
   'Professeure Aïcha', 'Directrice de Recherche',
   '#16A34A', '', 2),

  ('tech_scavengers', 'L''Ordre Ancien',
   'Société secrète millénaire qui connaissait l''existence du réseau bien avant sa découverte officielle. Mystiques et technomanciens.',
   'L''Ordre Ancien existait bien avant la découverte officielle des cristaux. Leurs archives, transmises de génération en génération, décrivent avec précision le réseau cristallin — des millénaires avant que la science ne le confirme. Comment ? C''est le plus grand mystère de l''Ordre. Leurs rituels de méditation cristalline, considérés comme de la superstition, se révèlent étrangement efficaces pour interagir avec le réseau. Le Codex des Origines, leur texte le plus sacré, affirme que les cristaux ne sont pas naturels — ils auraient été "plantés" par une intelligence extérieure. L''Ordre ne cherche pas à contrôler le réseau, mais à comprendre pourquoi il existe.',
   'Les cristaux se souviennent. Nous aussi.',
   'Grand Maître Eryndor', 'Gardien des Archives',
   '#D97706', '', 3);

-- ============================================
-- SERIES (3)
-- ============================================

INSERT INTO series (id, name, description, image_url, total_cards, reward_type, reward_desc, is_active) VALUES
  ('a2000000-0000-0000-0000-000000000001', 'Collection Consortium',
   'Rassemblez toutes les cartes du Consortium pour débloquer un cristal rare.',
   NULL, 4, 'gem_ruby', 'Cristal de Contrôle', true),
  ('a2000000-0000-0000-0000-000000000002', 'Artéfacts Légendaires',
   'Récupérez les artéfacts légendaires des quatre factions.',
   NULL, 3, 'gem_emerald', 'Cristal des Origines', true),
  ('a2000000-0000-0000-0000-000000000003', 'Collection Gardiens',
   'Unissez les chercheurs qui protègent le réseau.',
   NULL, 4, 'gem_sapphire', 'Cristal d''Harmonie', true);

-- ============================================
-- BASE CARDS (38)
-- ============================================

-- Le Consortium (dome_dwellers) — 10 cards
INSERT INTO cards (id, name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  -- Series 1 cards
  ('c0000001-0000-0000-0000-000000000001', 'Agent d''Extraction', 'Soldat corporatiste équipé contre la résonance cristalline.', '/images/cards/agent-extraction.svg', 'common', 'a2000000-0000-0000-0000-000000000001', 3, 4,
   'Les agents du Consortium portent des combinaisons anti-résonance. La prudence est leur première arme.', 'character', 'dome_dwellers'),
  ('c0000001-0000-0000-0000-000000000002', 'Drone Foreuse', 'Drone autonome d''extraction cristalline.', '/images/cards/drone-foreuse.svg', 'common', NULL, 2, 3,
   'Ces drones autonomes creusent sans relâche, sourds aux chants des cristaux.', 'artifact', 'dome_dwellers'),
  ('c0000001-0000-0000-0000-000000000003', 'Raffinerie Mobile', 'Unité mobile de traitement cristallin.', '/images/cards/raffinerie-mobile.svg', 'uncommon', 'a2000000-0000-0000-0000-000000000001', 1, 5,
   'Le Consortium transforme les cristaux bruts en énergie pure. Le rendement importe plus que la beauté.', 'location', 'dome_dwellers'),
  ('c0000001-0000-0000-0000-000000000004', 'Ingénieur Cristallin', 'Expert en technologie cristalline du Consortium.', '/images/cards/ingenieur-cristallin.svg', 'uncommon', NULL, 3, 4,
   'Former un ingénieur cristallin coûte plus cher que dix ans d''extraction. Chacun est irremplaçable.', 'character', 'dome_dwellers'),
  ('c0000001-0000-0000-0000-000000000005', 'Salle du Conseil', 'Salle de décision stratégique du Consortium.', '/images/cards/salle-conseil.svg', 'rare', 'a2000000-0000-0000-0000-000000000001', 1, 7,
   'Chaque décision prise ici affecte le cours des cristaux — et le cours du monde.', 'location', 'dome_dwellers'),
  ('c0000001-0000-0000-0000-000000000006', 'Protocole de Confinement', 'Procédure de sécurité d''urgence cristalline.', '/images/cards/protocole-confinement.svg', 'rare', NULL, 5, 3,
   'Quand un filon devient instable, le Consortium n''hésite pas : on scelle et on oublie.', 'event', 'dome_dwellers'),
  ('c0000001-0000-0000-0000-000000000007', 'Commandante Voss', 'Chef de la Force de Sécurité Cristalline.', '/images/cards/commandante-voss.svg', 'epic', 'a2000000-0000-0000-0000-000000000001', 6, 5,
   'Voss dirige la Force de Sécurité Cristalline. Sa loyauté va au Consortium, jamais aux individus.', 'character', 'dome_dwellers'),
  ('c0000001-0000-0000-0000-000000000008', 'Résonateur Industriel', 'Machine d''amplification des signaux cristallins.', '/images/cards/resonateur-industriel.svg', 'epic', NULL, 5, 6,
   'Le Résonateur amplifie les signaux cristallins pour localiser les gisements profonds. Entre de mauvaises mains...', 'artifact', 'dome_dwellers'),
  ('c0000001-0000-0000-0000-000000000009', 'PDG Aldemar', 'Directeur Suprême du Consortium.', '/images/cards/pdg-aldemar.svg', 'legendary', NULL, 8, 7,
   'Aldemar a bâti un empire sur les cristaux. On dit qu''il entend le réseau murmurer la nuit.', 'character', 'dome_dwellers'),
  ('c0000001-0000-0000-0000-000000000010', 'Éclat Primordial', 'Le tout premier cristal extrait à Madagascar.', '/images/cards/eclat-primordial.svg', 'legendary', 'a2000000-0000-0000-0000-000000000002', 7, 8,
   'Le premier cristal extrait à Madagascar. Il pulse encore, comme un cœur qui n''a jamais cessé de battre.', 'artifact', 'dome_dwellers');

-- Les Profonds (underground_resistance) — 10 cards
INSERT INTO cards (id, name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('c0000002-0000-0000-0000-000000000001', 'Mineur Éclaireur', 'Éclaireur des galeries cristallines.', '/images/cards/mineur-eclaireur.svg', 'common', NULL, 4, 2,
   'Les éclaireurs des Profonds connaissent chaque galerie, chaque fissure, chaque cristal.', 'character', 'underground_resistance'),
  ('c0000002-0000-0000-0000-000000000002', 'Pioche Résonante', 'Outil minier forgé en alliage cristallin.', '/images/cards/pioche-resonante.svg', 'common', NULL, 3, 2,
   'Forgée dans un alliage cristallin, elle vibre au contact des filons cachés.', 'artifact', 'underground_resistance'),
  ('c0000002-0000-0000-0000-000000000003', 'Galerie Secrète', 'Tunnel non cartographié des Profonds.', '/images/cards/galerie-secrete.svg', 'common', NULL, 2, 4,
   'Des kilomètres de tunnels non cartographiés. Le royaume des Profonds.', 'location', 'underground_resistance'),
  ('c0000002-0000-0000-0000-000000000004', 'Saboteuse Quartz', 'Infiltrée spécialisée dans le sabotage cristallin.', '/images/cards/saboteuse-quartz.svg', 'uncommon', NULL, 4, 3,
   'Elle infiltre les sites du Consortium et libère les cristaux captifs.', 'character', 'underground_resistance'),
  ('c0000002-0000-0000-0000-000000000005', 'Brouilleur Cristallin', 'Appareil de brouillage des fréquences cristallines.', '/images/cards/brouilleur-cristallin.svg', 'uncommon', NULL, 3, 3,
   'Cet appareil brouille les fréquences du réseau, rendant les mines invisibles aux scanners.', 'artifact', 'underground_resistance'),
  ('c0000002-0000-0000-0000-000000000006', 'Éboulement Tactique', 'Effondrement contrôlé de galerie.', '/images/cards/eboulement-tactique.svg', 'rare', NULL, 5, 4,
   'Les Profonds maîtrisent l''art de faire s''effondrer un tunnel au bon moment.', 'event', 'underground_resistance'),
  ('c0000002-0000-0000-0000-000000000007', 'Forteresse Souterraine', 'Bastion taillé dans une géode géante.', '/images/cards/forteresse-souterraine.svg', 'rare', NULL, 3, 7,
   'Taillée dans la géode elle-même, ses murs scintillent de mille reflets.', 'location', 'underground_resistance'),
  ('c0000002-0000-0000-0000-000000000008', 'Maître des Galeries', 'Chef suprême des Profonds.', '/images/cards/maitre-galeries.svg', 'epic', NULL, 7, 5,
   'Il commande les Profonds depuis les ténèbres. Sa voix porte dans chaque cristal.', 'character', 'underground_resistance'),
  ('c0000002-0000-0000-0000-000000000009', 'Cœur de Géode', 'Noyau cristallin d''une géode géante.', '/images/cards/coeur-geode.svg', 'epic', NULL, 6, 6,
   'Le noyau cristallin d''une géode géante. Il amplifie la volonté de celui qui le touche.', 'artifact', 'underground_resistance'),
  ('c0000002-0000-0000-0000-000000000010', 'La Doyenne Nyra', 'Première découvreuse du réseau cristallin.', '/images/cards/doyenne-nyra.svg', 'legendary', NULL, 9, 7,
   'Nyra a découvert le réseau la première. Elle est la mémoire vivante des Profonds.', 'character', 'underground_resistance');

-- Les Gardiens du Réseau (surface_survivors) — 10 cards
INSERT INTO cards (id, name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  -- Series 3 cards
  ('c0000003-0000-0000-0000-000000000001', 'Chercheur Itinérant', 'Scientifique nomade cartographiant le réseau.', '/images/cards/chercheur-itinerant.svg', 'common', 'a2000000-0000-0000-0000-000000000003', 3, 3,
   'Les Gardiens voyagent de gisement en gisement, cartographiant le réseau sans relâche.', 'character', 'surface_survivors'),
  ('c0000003-0000-0000-0000-000000000002', 'Cristal-Sonde', 'Instrument de mesure de résonance cristalline.', '/images/cards/cristal-sonde.svg', 'common', NULL, 2, 3,
   'Cet instrument mesure la résonance cristalline avec une précision nanométrique.', 'artifact', 'surface_survivors'),
  ('c0000003-0000-0000-0000-000000000003', 'Alerte Sismique', 'Signal d''avertissement du réseau.', '/images/cards/alerte-sismique.svg', 'uncommon', NULL, 4, 1,
   'Quand le réseau tremble, les Gardiens sont les premiers à le savoir — et les premiers à agir.', 'event', 'surface_survivors'),
  ('c0000003-0000-0000-0000-000000000004', 'Camp de Recherche', 'Base scientifique mobile des Gardiens.', '/images/cards/camp-recherche.svg', 'uncommon', 'a2000000-0000-0000-0000-000000000003', 2, 5,
   'Des tentes high-tech plantées au milieu des filons. La science au plus près du cristal.', 'location', 'surface_survivors'),
  ('c0000003-0000-0000-0000-000000000005', 'Géologue Vétéran', 'Expert de terrain aux 30 ans d''expérience.', '/images/cards/geologue-veteran.svg', 'rare', 'a2000000-0000-0000-0000-000000000003', 4, 5,
   'Trente ans sur le terrain. Il lit les cristaux comme d''autres lisent des livres.', 'character', 'surface_survivors'),
  ('c0000003-0000-0000-0000-000000000006', 'Harmonisateur de Réseau', 'Appareil de synchronisation cristalline.', '/images/cards/harmonisateur-reseau.svg', 'rare', NULL, 3, 6,
   'Cet appareil synchronise les fréquences cristallines, permettant de ''parler'' au réseau.', 'artifact', 'surface_survivors'),
  ('c0000003-0000-0000-0000-000000000007', 'Tempête Cristalline', 'Déchaînement du réseau cristallin.', '/images/cards/tempete-cristalline.svg', 'epic', NULL, 7, 3,
   'Quand le réseau s''emballe, des éclats de cristal jaillissent du sol. Mortel et magnifique.', 'event', 'surface_survivors'),
  ('c0000003-0000-0000-0000-000000000008', 'Archive Vivante', 'Réseau de cristaux stockant la mémoire planétaire.', '/images/cards/archive-vivante.svg', 'epic', NULL, 4, 7,
   'Un réseau de cristaux interconnectés qui stocke la mémoire de la planète depuis des millénaires.', 'location', 'surface_survivors'),
  ('c0000003-0000-0000-0000-000000000009', 'Professeure Aïcha', 'Décrypteuse du langage du réseau.', '/images/cards/professeure-aicha.svg', 'legendary', 'a2000000-0000-0000-0000-000000000003', 8, 6,
   'Aïcha a décodé le langage du réseau. Ce qu''elle a appris pourrait sauver — ou condamner — l''humanité.', 'character', 'surface_survivors'),
  ('c0000003-0000-0000-0000-000000000010', 'Nexus Planétaire', 'Point de convergence du réseau cristallin mondial.', '/images/cards/nexus-planetaire.svg', 'legendary', 'a2000000-0000-0000-0000-000000000002', 7, 9,
   'Le point de convergence de tout le réseau cristallin. Celui qui le contrôle contrôle la Terre.', 'artifact', 'surface_survivors');

-- L'Ordre Ancien (tech_scavengers) — 8 cards
INSERT INTO cards (id, name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('c0000004-0000-0000-0000-000000000001', 'Initié de l''Ordre', 'Novice méditant devant les cristaux.', '/images/cards/initie-ordre.svg', 'common', NULL, 3, 3,
   'Les initiés méditent devant les cristaux pendant des jours, apprenant à sentir le réseau.', 'character', 'tech_scavengers'),
  ('c0000004-0000-0000-0000-000000000002', 'Relique Cristalline', 'Relique cristalline pré-civilisation.', '/images/cards/relique-cristalline.svg', 'common', NULL, 2, 4,
   'Cette relique est antérieure à toute civilisation connue. L''Ordre la conserve depuis des siècles.', 'artifact', 'tech_scavengers'),
  ('c0000004-0000-0000-0000-000000000003', 'Ritualiste Ambre', 'Ritualiste canalisant la résonance par d''anciens chants.', '/images/cards/ritualiste-ambre.svg', 'uncommon', NULL, 4, 3,
   'Les ritualistes canalisent la résonance cristalline par d''anciens chants.', 'character', 'tech_scavengers'),
  ('c0000004-0000-0000-0000-000000000004', 'Sanctuaire Caché', 'Sanctuaire cristallin sous une montagne sacrée.', '/images/cards/sanctuaire-cache.svg', 'uncommon', NULL, 2, 5,
   'Sous chaque montagne sacrée, l''Ordre a construit un sanctuaire cristallin.', 'location', 'tech_scavengers'),
  ('c0000004-0000-0000-0000-000000000005', 'Gardien du Savoir', 'Protecteur des archives de l''Ordre.', '/images/cards/gardien-savoir.svg', 'rare', NULL, 5, 5,
   'Il protège les archives de l''Ordre depuis 40 ans. Les cristaux lui parlent.', 'character', 'tech_scavengers'),
  ('c0000004-0000-0000-0000-000000000006', 'Prophétie Minérale', 'Prophétie ancienne sur le réseau cristallin.', '/images/cards/prophetie-minerale.svg', 'rare', NULL, 4, 4,
   'Les textes anciens prédisaient la découverte du réseau. Et ce qui viendrait après.', 'event', 'tech_scavengers'),
  ('c0000004-0000-0000-0000-000000000007', 'Grand Maître Eryndor', 'Dernier maître du chant complet de résonance.', '/images/cards/grand-maitre-eryndor.svg', 'epic', NULL, 7, 6,
   'Eryndor est le dernier à maîtriser le chant complet de résonance.', 'character', 'tech_scavengers'),
  ('c0000004-0000-0000-0000-000000000008', 'Codex des Origines', 'Le livre interdit révélant la vérité sur les cristaux.', '/images/cards/codex-origines.svg', 'legendary', 'a2000000-0000-0000-0000-000000000002', 6, 9,
   'Le livre interdit qui raconte la vérité : les cristaux ne sont pas naturels. Ils ont été plantés.', 'artifact', 'tech_scavengers');

-- ============================================
-- CHRONICLES CARDS (24 — new cards for arcs 1-3)
-- ============================================

-- Arc 1: Les Lumières de la Géode — Géode de Madagascar (8 cards)
INSERT INTO cards (id, name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('cc100001-0000-0000-0000-000000000000', 'Éclaireur Cristallin', 'Explorateur des cavernes de la géode.', '/images/cards/eclaireur-neon.svg', 'common', NULL, 3, 2,
   'Les premiers explorateurs de la géode de Madagascar avancent dans un monde de reflets émeraude.', 'character', 'tech_scavengers'),
  ('cc100002-0000-0000-0000-000000000000', 'Sentinelle de Pierre', 'Gardien minéral des entrées de la géode.', '/images/cards/sentinelle-rouillee.svg', 'common', NULL, 2, 4,
   'Les sentinelles de pierre veillent aux entrées de la géode depuis des temps immémoriaux.', 'character', 'tech_scavengers'),
  ('cc100003-0000-0000-0000-000000000000', 'Prospecteur de Filons', 'Spécialiste de la détection de filons cristallins.', '/images/cards/chasseur-fragments.svg', 'uncommon', NULL, 4, 3,
   'Les filons cristallins sont les artères du réseau. Les trouver, c''est toucher le cœur de la Terre.', 'character', 'tech_scavengers'),
  ('cc100004-0000-0000-0000-000000000000', 'Contrebandière de Cristaux', 'Trafiquante de cristaux dans les galeries.', '/images/cards/marchande-ombres.svg', 'uncommon', NULL, 3, 3,
   'Son commerce prospère là où les scanners du Consortium ne pénètrent pas.', 'character', 'underground_resistance'),
  ('cc100005-0000-0000-0000-000000000000', 'Golem de Quartz', 'Créature née de la résonance cristalline.', '/images/cards/golem-cables.svg', 'rare', NULL, 6, 5,
   'Les golems de quartz sont nés quand la résonance a atteint un seuil critique dans la géode.', 'character', 'tech_scavengers'),
  ('cc100006-0000-0000-0000-000000000000', 'Écho Cristallin', 'Manifestation spectrale du réseau.', '/images/cards/spectre-holographique.svg', 'rare', NULL, 4, 4,
   'L''écho répète les mémoires stockées dans les cristaux. Personne ne sait s''il est conscient.', 'character', 'tech_scavengers'),
  ('cc100007-0000-0000-0000-000000000000', 'Archonte de la Géode', 'Seigneur des cavernes cristallines.', '/images/cards/archonte-neon.svg', 'epic', NULL, 7, 6,
   'Il règne sur les cavernes cristallines de Madagascar depuis la grande découverte.', 'character', 'tech_scavengers'),
  ('cc100008-0000-0000-0000-000000000000', 'Titan d''Émeraude', 'Colosse cristallin gardien de la géode.', '/images/cards/titan-chrome.svg', 'legendary', NULL, 9, 8,
   'Le Titan d''Émeraude serait le gardien originel de la géode — éveillé par la première pioche de Nyra.', 'character', 'tech_scavengers');

-- Arc 2: Filons et Prophéties — Plateaux de l'Inde (6 cards)
INSERT INTO cards (id, name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('cc200001-0000-0000-0000-000000000000', 'Chercheur des Plateaux', 'Scientifique nomade des plateaux indiens.', '/images/cards/nomade-cendres.svg', 'common', NULL, 3, 3,
   'Les plateaux de l''Inde abritent les filons cristallins les plus accessibles — et les plus convoités.', 'character', 'surface_survivors'),
  ('cc200002-0000-0000-0000-000000000000', 'Cristal Sauvage', 'Cristal en croissance libre sur les plateaux.', '/images/cards/scorpion-mutant.svg', 'common', NULL, 4, 3,
   'Les cristaux sauvages poussent à même la roche, nourris par le réseau souterrain.', 'character', 'surface_survivors'),
  ('cc200003-0000-0000-0000-000000000000', 'Oracle du Réseau', 'Interprète des signaux cristallins.', '/images/cards/prophete-sable.svg', 'uncommon', NULL, 3, 4,
   'Les oracles du réseau entendent des messages dans la résonance — promesses ou menaces, nul ne sait.', 'character', 'surface_survivors'),
  ('cc200004-0000-0000-0000-000000000000', 'Colonne Résonante', 'Pilier cristallin naturel émettant des fréquences.', '/images/cards/colosse-rouille.svg', 'rare', NULL, 6, 6,
   'Les colonnes résonantes jalonnent les plateaux, émettant un chant que seuls les Gardiens comprennent.', 'character', 'surface_survivors'),
  ('cc200005-0000-0000-0000-000000000000', 'Tempête de Résonance', 'Déchaînement des fréquences cristallines.', '/images/cards/reine-tempetes.svg', 'epic', NULL, 7, 5,
   'Quand les cristaux des plateaux entrent en résonance simultanée, des éclats jaillissent du sol.', 'character', 'surface_survivors'),
  ('cc200006-0000-0000-0000-000000000000', 'Nexus Indien', 'Point de convergence cristallin des plateaux.', '/images/cards/leviathan-enseveli.svg', 'legendary', NULL, 10, 9,
   'Le Nexus Indien est un nœud majeur du réseau planétaire. Son activation changerait tout.', 'character', 'surface_survivors');

-- Arc 3: Abysses Cristallines — Abysses de Sibérie (10 cards)
INSERT INTO cards (id, name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('cc300001-0000-0000-0000-000000000000', 'Mineur des Abysses', 'Explorateur des mines profondes sibériennes.', '/images/cards/plongeur-aveugle.svg', 'common', NULL, 2, 3,
   'Les mines de Sibérie descendent à des profondeurs que nul n''avait atteintes avant les Profonds.', 'character', 'underground_resistance'),
  ('cc300002-0000-0000-0000-000000000000', 'Cristal Luminescent', 'Cristal émettant une lumière propre dans les ténèbres.', '/images/cards/meduse-radioactive.svg', 'common', NULL, 3, 2,
   'Dans les ténèbres des mines sibériennes, les cristaux luminescents sont la seule source de lumière.', 'character', 'underground_resistance'),
  ('cc300003-0000-0000-0000-000000000000', 'Pilleur de Filons', 'Mineur clandestin des galeries profondes.', '/images/cards/pirate-recifs.svg', 'common', NULL, 4, 2,
   'Là où le Consortium voit des ressources à sécuriser, les pillards voient la liberté.', 'character', 'underground_resistance'),
  ('cc300004-0000-0000-0000-000000000000', 'Voix de la Roche', 'Mineur capable de sentir les cristaux à travers la pierre.', '/images/cards/sirene-corrompue.svg', 'uncommon', NULL, 4, 3,
   'Sa voix résonne dans les galeries comme un chant cristallin. Les roches lui répondent.', 'character', 'underground_resistance'),
  ('cc300005-0000-0000-0000-000000000000', 'Blindé des Profondeurs', 'Véhicule lourd de minage en milieu hostile.', '/images/cards/requin-blinde.svg', 'uncommon', NULL, 5, 4,
   'Les blindés des profondeurs résistent à la pression et à la résonance des cristaux les plus puissants.', 'character', 'underground_resistance'),
  ('cc300006-0000-0000-0000-000000000000', 'Filon Ancestral', 'Filon cristallin millénaire aux propriétés inconnues.', '/images/cards/kraken-petrole.svg', 'rare', NULL, 7, 5,
   'Les filons ancestraux pulsent d''une énergie que même l''Ordre Ancien ne comprend pas entièrement.', 'character', 'underground_resistance'),
  ('cc300007-0000-0000-0000-000000000000', 'Spectre des Mines', 'Apparition cristalline hantant les galeries abandonnées.', '/images/cards/amiral-fantome.svg', 'rare', NULL, 5, 6,
   'Il erre dans les galeries abandonnées. Certains disent que c''est un ancien mineur cristallisé.', 'character', 'underground_resistance'),
  ('cc300008-0000-0000-0000-000000000000', 'Hydre Cristalline', 'Formation multi-branches de cristaux actifs.', '/images/cards/hydre-abyssale.svg', 'epic', NULL, 8, 6,
   'Chaque branche de l''hydre cristalline émet une fréquence différente. Ensemble, elles sont dévastatrices.', 'character', 'underground_resistance'),
  ('cc300009-0000-0000-0000-000000000000', 'Gardien des Abysses', 'Entité cristalline des profondeurs ultimes.', '/images/cards/poseidon-corrompu.svg', 'epic', NULL, 8, 7,
   'Le Gardien des Abysses protège l''accès au Nexus. Il ne juge pas — il teste.', 'character', 'underground_resistance'),
  ('cc300010-0000-0000-0000-000000000000', 'Cœur de Sibérie', 'Le cristal le plus profond et le plus puissant.', '/images/cards/abomination-abysses.svg', 'legendary', NULL, 10, 10,
   'Au fond des abysses sibériennes, un cristal colossal pulse d''une énergie qui fait trembler le continent.', 'character', 'underground_resistance');

-- ============================================
-- BOOSTER TYPES (8)
-- ============================================

INSERT INTO booster_types (id, name, description, image_url, cards_count, price_gems, price_cents, drop_rates, is_active, faction_filter, guaranteed_rarity) VALUES
  ('b2000000-0000-0000-0000-000000000001', 'Booster Classique', '8 cristaux de rareté variée. Garanti rare minimum.', NULL, 8, 100, NULL,
   '{"common":0.50,"uncommon":0.25,"rare":0.15,"epic":0.08,"legendary":0.02}', true, NULL, 'rare'),
  ('b2000000-0000-0000-0000-000000000002', 'Booster Premium', '6 cristaux de haute qualité. Chances accrues d''épique.', NULL, 6, 300, 399,
   '{"common":0.30,"uncommon":0.30,"rare":0.25,"epic":0.12,"legendary":0.03}', true, NULL, 'rare'),
  ('b2000000-0000-0000-0000-000000000003', 'Booster Faction', 'Désactivé.', NULL, 5, 200, 249,
   '{"common":0.50,"uncommon":0.25,"rare":0.15,"epic":0.08,"legendary":0.02}', false, NULL, NULL),
  ('b2000000-0000-0000-0000-000000000004', 'Booster Légendaire', '7 cristaux avec les meilleures chances de légendaire.', NULL, 7, 500, 599,
   '{"common":0.20,"uncommon":0.25,"rare":0.25,"epic":0.20,"legendary":0.10}', true, NULL, 'epic'),
  ('b2000000-0000-0000-0000-000000000010', 'Booster Consortium', 'Uniquement des cartes du Consortium.', NULL, 5, 150, NULL,
   '{"common":0.45,"uncommon":0.30,"rare":0.15,"epic":0.08,"legendary":0.02}', true, 'dome_dwellers', 'uncommon'),
  ('b2000000-0000-0000-0000-000000000011', 'Booster Les Profonds', 'Uniquement des cartes des Profonds.', NULL, 5, 150, NULL,
   '{"common":0.45,"uncommon":0.30,"rare":0.15,"epic":0.08,"legendary":0.02}', true, 'underground_resistance', 'uncommon'),
  ('b2000000-0000-0000-0000-000000000012', 'Booster Gardiens du Réseau', 'Uniquement des cartes des Gardiens.', NULL, 5, 150, NULL,
   '{"common":0.45,"uncommon":0.30,"rare":0.15,"epic":0.08,"legendary":0.02}', true, 'surface_survivors', 'uncommon'),
  ('b2000000-0000-0000-0000-000000000013', 'Booster Ordre Ancien', 'Uniquement des cartes de l''Ordre Ancien.', NULL, 5, 150, NULL,
   '{"common":0.45,"uncommon":0.30,"rare":0.15,"epic":0.08,"legendary":0.02}', true, 'tech_scavengers', 'uncommon');

-- ============================================
-- ACHIEVEMENTS (5)
-- ============================================

INSERT INTO achievements (name, description, icon_url, condition_type, condition_value, reward_gems, reward_xp) VALUES
  ('Cristallophile', 'Ouvrez 10 boosters.', NULL, 'boosters_opened', 10, 200, 50),
  ('Mineur Assidu', 'Connectez-vous 5 jours consécutifs.', NULL, 'login_streak', 5, 150, 40),
  ('Grand Collectionneur', 'Collectionnez 50 cristaux.', NULL, 'cards_collected', 50, 500, 100),
  ('Maître de Série', 'Complétez une série.', NULL, 'series_completed', 1, 500, 100),
  ('Diplomate Cristallin', 'Possédez au moins un cristal de chaque faction.', NULL, 'all_factions', 4, 300, 75);

-- ============================================
-- TALENT TREES (4 faction + 3 universal)
-- ============================================

-- Ensure the faction check constraint allows 'all' for universal talent trees
ALTER TABLE talent_trees DROP CONSTRAINT IF EXISTS talent_trees_faction_check;
ALTER TABLE talent_trees ADD CONSTRAINT talent_trees_faction_check
  CHECK (faction IN ('dome_dwellers', 'underground_resistance', 'surface_survivors', 'tech_scavengers', 'all'));

-- Faction talent trees
INSERT INTO talent_trees (id, name, description, faction) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Ingénierie Cristalline', 'Maîtrisez la technologie d''extraction des cristaux.', 'dome_dwellers'),
  ('d1000000-0000-0000-0000-000000000002', 'Voix des Profondeurs', 'Développez votre lien avec les galeries cristallines.', 'underground_resistance'),
  ('d1000000-0000-0000-0000-000000000003', 'Science du Réseau', 'Approfondissez votre compréhension du réseau planétaire.', 'surface_survivors'),
  ('d1000000-0000-0000-0000-000000000004', 'Rituels Anciens', 'Débloquez les secrets oubliés de l''Ordre.', 'tech_scavengers');

-- Universal talent trees
INSERT INTO talent_trees (id, name, description, faction) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Maître des Boosters', 'Améliorez vos chances lors de l''ouverture de boosters.', 'all'),
  ('b1000000-0000-0000-0000-000000000002', 'Collectionneur', 'Obtenez des bonus en collectionnant des cartes.', 'all'),
  ('b1000000-0000-0000-0000-000000000003', 'Fortune', 'Augmentez vos revenus en gemmes.', 'all');

-- ============================================
-- TALENTS
-- ============================================

-- Ingénierie Cristalline (dome_dwellers)
INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
  ('ea100000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Blindage Renforcé',
   '+10% gemmes lors de l''ouverture de boosters Consortium.', 1, 1, 'gem_on_open', '{"value":0.10,"faction":"dome_dwellers"}', NULL),
  ('ea100000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'Recyclage Optimisé',
   '+20% gemmes lors du recyclage de cartes Consortium.', 2, 2, 'gem_bonus', '{"type":"recycle","value":0.2,"faction":"dome_dwellers"}', 'ea100000-0000-0000-0000-000000000001'),
  ('ea100000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'Privilège du Consortium',
   '-10% sur les boosters Consortium.', 3, 3, 'discount', '{"type":"booster","value":0.1,"faction":"dome_dwellers"}', 'ea100000-0000-0000-0000-000000000002');

-- Voix des Profondeurs (underground_resistance)
INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
  ('ea200000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002', 'Frappe Souterraine',
   '+5% chances de carte rare dans les boosters Profonds.', 1, 1, 'drop_rate_boost', '{"rarity":"rare","value":0.05,"faction":"underground_resistance"}', NULL),
  ('ea200000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'Réseau d''Écoute',
   'Prévisualisation du contenu des boosters.', 2, 2, 'booster_preview', '{"enabled":true}', 'ea200000-0000-0000-0000-000000000001'),
  ('ea200000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002', 'Sabotage Cristallin',
   '+5% de chances de rare+ dans les boosters.', 3, 3, 'drop_rate_boost', '{"rarity":"rare","value":0.05}', 'ea200000-0000-0000-0000-000000000002');

-- Science du Réseau (surface_survivors)
INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
  ('ea300000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000003', 'Armure Naturelle',
   '+15% XP lors de la collecte de cartes des Gardiens.', 1, 1, 'xp_bonus', '{"value":0.15,"faction":"surface_survivors"}', NULL),
  ('ea300000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000003', 'Instinct de Prospection',
   '+5 gemmes par booster ouvert.', 2, 2, 'gem_on_open', '{"value":5}', 'ea300000-0000-0000-0000-000000000001'),
  ('ea300000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003', 'Immunité Résonante',
   '+25% XP bonus.', 3, 3, 'xp_boost', '{"value":0.25}', 'ea300000-0000-0000-0000-000000000002'),
  ('ea300000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000003', 'Bénédiction d''Aïcha',
   'Débloque une quête secrète des Gardiens.', 4, 4, 'unlock_quest', '{"quest":"aicha_blessing"}', 'ea300000-0000-0000-0000-000000000003');

-- Rituels Anciens (tech_scavengers)
INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
  ('ea400000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000004', 'Analyse Rituelle',
   '+10 gemmes bonus par booster Ordre Ancien ouvert.', 1, 1, 'gem_on_open', '{"value":10,"faction":"tech_scavengers"}', NULL),
  ('ea400000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000004', 'Ingénierie Inverse',
   'Carte bonus lors de l''ouverture de boosters.', 2, 2, 'extra_card', '{"value":1}', 'ea400000-0000-0000-0000-000000000001'),
  ('ea400000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000004', 'Décryptage Quantique',
   '+5% de chances de rare+ dans les boosters.', 3, 3, 'drop_rate_boost', '{"rarity":"rare","value":0.05}', 'ea400000-0000-0000-0000-000000000002');

-- Universal: Maître des Boosters
INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Œil du Collectionneur',
   '+2% chances de uncommon+.', 1, 1, 'drop_rate_bonus', '{"rarity":"uncommon","value":0.02}', NULL),
  ('f1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Chance Dorée',
   '+3% chances de rare+.', 2, 1, 'drop_rate_bonus', '{"rarity":"rare","value":0.03}', 'f1000000-0000-0000-0000-000000000001'),
  ('f1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'Instinct Légendaire',
   '+2% chances de legendary.', 3, 2, 'drop_rate_bonus', '{"rarity":"legendary","value":0.02}', 'f1000000-0000-0000-0000-000000000002'),
  ('f1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'Booster Étendu',
   '+1 carte dans chaque booster.', 4, 2, 'extra_cards', '{"value":1}', 'f1000000-0000-0000-0000-000000000003'),
  ('f1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', 'Maître des Boosters',
   'Garantie épique minimum.', 5, 3, 'guaranteed_rarity', '{"rarity":"epic"}', 'f1000000-0000-0000-0000-000000000004');

-- Universal: Collectionneur
INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
  ('f2000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Apprenti Chercheur',
   '+10% XP par nouvelle carte.', 1, 1, 'xp_bonus', '{"type":"new_card","value":0.10}', NULL),
  ('f2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'Catalogue Mental',
   'Révèle les cartes manquantes dans la collection.', 2, 1, 'reveal_missing', '{"enabled":true}', 'f2000000-0000-0000-0000-000000000001'),
  ('f2000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'Collectionneur Acharné',
   '+25% XP pour les nouvelles cartes.', 3, 2, 'new_card_xp_bonus', '{"value":0.25}', 'f2000000-0000-0000-0000-000000000002'),
  ('f2000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'Expert en Séries',
   '+50 gemmes bonus par série complétée.', 4, 2, 'series_bonus_gems', '{"value":50}', 'f2000000-0000-0000-0000-000000000003'),
  ('f2000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', 'Archiviste Suprême',
   'x2 récompenses d''achievements.', 5, 3, 'achievement_reward_multiplier', '{"value":2}', 'f2000000-0000-0000-0000-000000000004');

-- Universal: Fortune
INSERT INTO talents (id, talent_tree_id, name, description, tier, cost, effect_type, effect_value, prerequisite_talent_id) VALUES
  ('f3000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', 'Poches Profondes',
   '+5 gemmes quotidiennes.', 1, 1, 'daily_bonus_gems', '{"value":5}', NULL),
  ('f3000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'Négociateur',
   '-5% sur les boosters.', 2, 1, 'booster_discount', '{"value":0.05}', 'f3000000-0000-0000-0000-000000000001'),
  ('f3000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'Marchand Aguerri',
   '-10% sur les boosters (cumulable).', 3, 2, 'booster_discount', '{"value":0.10}', 'f3000000-0000-0000-0000-000000000002'),
  ('f3000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003', 'Investisseur',
   '+100 gemmes par série complétée.', 4, 2, 'series_bonus_gems', '{"value":100}', 'f3000000-0000-0000-0000-000000000003'),
  ('f3000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 'Magnat des Gemmes',
   '+1 booster gratuit quotidien.', 5, 3, 'extra_free_booster', '{"value":1}', 'f3000000-0000-0000-0000-000000000004');

-- ============================================
-- STORY ARCS (4)
-- ============================================

INSERT INTO story_arcs (id, slug, name, description, region, faction, image_url, sort_order) VALUES
  ('aa000001-0000-0000-0000-000000000000', 'lumieres-geode', 'Les Lumières de la Géode',
   'Dans les cavernes cristallines de Madagascar, les reflets émeraude guident ceux qui osent descendre.', 'neon_ruins', NULL, NULL, 1),
  ('aa000002-0000-0000-0000-000000000000', 'filons-propheties', 'Filons et Prophéties',
   'Sur les plateaux de l''Inde, les cristaux poussent à la surface et les Gardiens étudient leurs messages.', 'ash_desert', NULL, NULL, 2),
  ('aa000003-0000-0000-0000-000000000000', 'abysses-cristallines', 'Abysses Cristallines',
   'Dans les mines sibériennes, les cristaux les plus profonds et les plus puissants attendent.', 'toxic_ocean', NULL, NULL, 3),
  ('aa000004-0000-0000-0000-000000000000', 'guerre-cristaux', 'La Guerre des Cristaux',
   'Quatre factions. Un réseau planétaire. Un seul pourra décider de son avenir.', NULL, NULL, NULL, 4);

-- ============================================
-- STORY CHAPTERS (12)
-- ============================================

-- Arc 1: Les Lumières de la Géode
INSERT INTO story_chapters (id, arc_id, slug, name, description, sort_order, reward_gems, reward_xp) VALUES
  ('ac010001-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000000', 'premiers-cristaux', 'Premiers Cristaux',
   'Exploration initiale de la géode de Madagascar.', 1, 50, 20),
  ('ac010002-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000000', 'sanctuaire-cache', 'Le Sanctuaire Caché',
   'Découverte d''un sanctuaire de l''Ordre Ancien au cœur de la géode.', 2, 80, 30),
  ('ac010003-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000000', 'coeur-geode', 'Le Cœur de la Géode',
   'Affrontement au cœur cristallin de Madagascar.', 3, 200, 100);

-- Arc 2: Filons et Prophéties
INSERT INTO story_chapters (id, arc_id, slug, name, description, sort_order, reward_gems, reward_xp) VALUES
  ('ac020001-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000000', 'camp-recherche', 'Le Camp de Recherche',
   'Les Gardiens étudient les filons cristallins des plateaux.', 1, 50, 20),
  ('ac020002-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000000', 'tempete-cristalline', 'La Tempête Cristalline',
   'Une tempête de résonance dévaste les plateaux indiens.', 2, 100, 50),
  ('ac020003-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000000', 'eveil-reseau', 'L''Éveil du Réseau',
   'Le réseau indien s''active soudainement.', 3, 200, 100);

-- Arc 3: Abysses Cristallines
INSERT INTO story_chapters (id, arc_id, slug, name, description, sort_order, reward_gems, reward_xp) VALUES
  ('ac030001-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000000', 'descente-mines', 'Descente dans les Mines',
   'Exploration des mines cristallines sibériennes.', 1, 40, 15),
  ('ac030002-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000000', 'cristaux-profonds', 'Les Cristaux Profonds',
   'Découverte de cristaux aux propriétés inconnues.', 2, 80, 30),
  ('ac030003-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000000', 'le-nexus', 'Le Nexus',
   'Au fond des abysses, le Nexus Planétaire attend.', 3, 200, 100);

-- Arc 4: La Guerre des Cristaux
INSERT INTO story_chapters (id, arc_id, slug, name, description, sort_order, reward_gems, reward_xp) VALUES
  ('ac040001-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000000', 'emissaires', 'Les Émissaires',
   'Les quatre factions se rencontrent pour la première fois.', 1, 60, 25),
  ('ac040002-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000000', 'reliques', 'Les Reliques',
   'Course aux artéfacts cristallins ancestraux.', 2, 100, 40),
  ('ac040003-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000000', 'denouement', 'Le Dénouement',
   'Activation — ou pas — du Nexus Planétaire.', 3, 500, 200);

-- ============================================
-- STORY NODES
-- ============================================

-- ── ARC 1: Les Lumières de la Géode ──

-- Chapter 1: Premiers Cristaux (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab010101-0000-0000-0000-000000000000', 'ac010001-0000-0000-0000-000000000000', 'eclaireur', 'L''Éclaireur Cristallin',
   'Les parois de la géode scintillent de reflets émeraude. Un éclaireur cristallin t''a repéré dans les cavernes. "Hé, toi ! Tu ne devrais pas être ici seul. La géode est pleine de dangers... et de merveilles."',
   'La géode de Madagascar fut découverte en 2156 lors d''une opération de forage de routine. Des cavernes immenses, tapissées de cristaux émeraude, s''étendaient sur des kilomètres sous la surface.',
   ARRAY['cc100001-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab010102-0000-0000-0000-000000000000', 'ac010001-0000-0000-0000-000000000000', 'sentinelle', 'Le Barrage',
   'Une sentinelle de pierre bloque le passage vers les cavernes intérieures. Ses yeux cristallins pulsent de lumière. "ACCÈS... RESTREINT..." Sa voix résonne dans la roche.',
   NULL,
   ARRAY['cc100002-0000-0000-0000-000000000000']::UUID[], 'ab010101-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab010103-0000-0000-0000-000000000000', 'ac010001-0000-0000-0000-000000000000', 'prospecteur', 'Le Filon',
   'Un prospecteur de filons t''attend au-delà de la sentinelle. "Je peux te guider vers les cristaux les plus purs, mais rien n''est gratuit dans la géode." Il fait tourner un éclat cristallin entre ses doigts.',
   'Les filons cristallins sont les artères du réseau planétaire. Chaque filon contient des données, des mémoires, des secrets anciens.',
   ARRAY['cc100003-0000-0000-0000-000000000000']::UUID[], 'ab010102-0000-0000-0000-000000000000', 3, 400, 0, 50, 20);

-- Chapter 2: Le Sanctuaire Caché (4 nodes with choice)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab010201-0000-0000-0000-000000000000', 'ac010002-0000-0000-0000-000000000000', 'contrebandiere', 'La Contrebandière',
   'La contrebandière de cristaux t''attend dans une alcôve secrète. Des cristaux scintillent autour d''elle. "Bienvenue dans mon domaine. J''ai quelque chose d''intéressant à te montrer..."',
   NULL,
   ARRAY['cc100004-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0);

INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, is_choice, choice_label, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab010202-0000-0000-0000-000000000000', 'ac010002-0000-0000-0000-000000000000', 'golem-path', 'Les Profondeurs',
   'Tu suis la contrebandière dans les profondeurs de la géode. Le sol vibre sous tes pieds. Un golem de quartz émerge de la paroi cristalline, ses facettes étincelant d''énergie. "Ne crains rien," murmure-t-elle. "Il protège le sanctuaire."',
   'Les golems de quartz sont nés quand la résonance cristalline a atteint un seuil critique dans la géode. Mi-minéral, mi-énergie vivante, ils errent dans les cavernes.',
   ARRAY['cc100005-0000-0000-0000-000000000000']::UUID[], 'ab010201-0000-0000-0000-000000000000', true, 'Suivre la contrebandière dans les profondeurs', 2, 200, -60, 0, 0),

  ('ab010203-0000-0000-0000-000000000000', 'ac010002-0000-0000-0000-000000000000', 'echo-path', 'L''Écho du Réseau',
   'Un écho cristallin apparaît devant toi, projetant une image d''un ancien ritualiste de l''Ordre. Il commence un chant : "Le réseau se souvient de ceux qui l''ont planté..." Sa voix se coupe, puis reprend en boucle.',
   'L''écho répète les mémoires stockées dans les cristaux de la géode. Les érudits débattent encore : est-ce un enregistrement millénaire, ou une intelligence cristalline ?',
   ARRAY['cc100006-0000-0000-0000-000000000000']::UUID[], 'ab010201-0000-0000-0000-000000000000', true, 'Écouter l''écho cristallin', 3, 200, 60, 0, 0);

INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab010204-0000-0000-0000-000000000000', 'ac010002-0000-0000-0000-000000000000', 'convergence-1', 'La Révélation',
   'Les deux chemins mènent au même sanctuaire : une salle immense tapissée de cristaux millénaires. Les inscriptions de l''Ordre Ancien couvrent chaque surface. Elles racontent l''histoire du réseau — et une carte indique le cœur de la géode.',
   NULL,
   '{}'::UUID[], 'ab010202-0000-0000-0000-000000000000', 4, 400, 0, 80, 30);

-- Chapter 3: Le Cœur de la Géode (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab010301-0000-0000-0000-000000000000', 'ac010003-0000-0000-0000-000000000000', 'archonte', 'L''Archonte',
   'L''archonte de la géode contrôle l''accès au cœur cristallin. Son armure brille de reflets émeraude, alimentée par la résonance de la géode. "Tu as réussi à arriver jusqu''ici. Impressionnant. Mais le vrai test commence maintenant."',
   NULL,
   ARRAY['cc100007-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab010302-0000-0000-0000-000000000000', 'ac010003-0000-0000-0000-000000000000', 'titan', 'Le Titan',
   'Le sol tremble. Les cristaux vibrent. Un titan d''émeraude émerge de la paroi, chaque pas faisant résonner toute la géode. Ses yeux — deux cristaux purs — se posent sur toi. L''archonte recule. "Impossible... Le gardien originel s''éveille..."',
   'Le Titan d''Émeraude serait le gardien originel de la géode de Madagascar. Son corps est un alliage cristallin inconnu. Certains disent qu''il veille depuis que les cristaux ont été plantés.',
   ARRAY['cc100008-0000-0000-0000-000000000000']::UUID[], 'ab010301-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab010303-0000-0000-0000-000000000000', 'ac010003-0000-0000-0000-000000000000', 'finale-geode', 'Lumière Cristalline',
   'Le Titan d''Émeraude te regarde. Pas avec hostilité, mais avec... reconnaissance. Il tend sa main massive et un flot de mémoires cristallines coule dans ton esprit. L''histoire de la géode. La vérité sur le réseau. Et un message, ancien et clair : "Le réseau attend d''être complété."',
   'La géode de Madagascar n''est pas un gisement — c''est un terminal. Le Titan veille, les cristaux pulsent, et quelque part dans le réseau, un plan millénaire attend d''être accompli.',
   '{}'::UUID[], 'ab010302-0000-0000-0000-000000000000', 3, 400, 0, 200, 100);

-- ── ARC 2: Filons et Prophéties ──

-- Chapter 1: Le Camp de Recherche (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab020101-0000-0000-0000-000000000000', 'ac020001-0000-0000-0000-000000000000', 'chercheur', 'Le Chercheur',
   'Le vent des plateaux porte des éclats de résonance cristalline. Un chercheur des Gardiens émerge d''une tente high-tech. "Tu étudies les filons ? Courageux — les cristaux indiens sont imprévisibles."',
   'Les plateaux de l''Inde abritent les filons cristallins les plus accessibles du monde. Les cristaux poussent à même la surface, nourris par le réseau souterrain.',
   ARRAY['cc200001-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab020102-0000-0000-0000-000000000000', 'ac020001-0000-0000-0000-000000000000', 'cristal-sauvage', 'Le Cristal Sauvage',
   'Un cristal sauvage jaillit du sol ! Ses facettes coupantes brillent d''une lumière aveuglante. Le chercheur saisit son équipement. "Reste derrière moi. Les cristaux en croissance sont instables."',
   NULL,
   ARRAY['cc200002-0000-0000-0000-000000000000']::UUID[], 'ab020101-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab020103-0000-0000-0000-000000000000', 'ac020001-0000-0000-0000-000000000000', 'oracle', 'L''Oracle',
   'Au sommet d''un affleurement cristallin, un oracle du réseau médite. Ses yeux s''ouvrent à ton approche. "L''Éveil approche. Le réseau parle de plus en plus fort." Il trace des formules dans la poussière cristalline.',
   'Les oracles du réseau entendent des messages dans la résonance cristalline. Nul ne sait si ces messages sont des échos du passé ou des avertissements pour l''avenir.',
   ARRAY['cc200003-0000-0000-0000-000000000000']::UUID[], 'ab020102-0000-0000-0000-000000000000', 3, 400, 0, 50, 20);

-- Chapter 2: La Tempête Cristalline (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab020201-0000-0000-0000-000000000000', 'ac020002-0000-0000-0000-000000000000', 'colonne', 'La Colonne',
   'Une colonne résonante domine le paysage, tel un phare de cristal. Son chant basse fréquence fait trembler le sol sur des kilomètres. "Elle s''active," murmure l''oracle. "Le réseau prépare quelque chose."',
   NULL,
   ARRAY['cc200004-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab020202-0000-0000-0000-000000000000', 'ac020002-0000-0000-0000-000000000000', 'tempete', 'La Tempête',
   'La tempête de résonance éclate ! Des éclats de cristal jaillissent du sol, tourbillonnant dans les airs. Le ciel se teinte de vert émeraude. "C''est magnifique... et mortel," dit le chercheur en se mettant à couvert.',
   'Quand les cristaux des plateaux entrent en résonance simultanée, une tempête cristalline se déclenche. Les éclats volent à des vitesses mortelles, mais le spectacle est d''une beauté surnaturelle.',
   ARRAY['cc200005-0000-0000-0000-000000000000']::UUID[], 'ab020201-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab020203-0000-0000-0000-000000000000', 'ac020002-0000-0000-0000-000000000000', 'apres-tempete', 'Après la Tempête',
   'Après la tempête, le paysage a changé. De nouveaux cristaux ont émergé, et les anciens brillent plus fort. Les instruments des Gardiens s''affolent. Le réseau indien est plus actif que jamais.',
   NULL,
   '{}'::UUID[], 'ab020202-0000-0000-0000-000000000000', 3, 400, 0, 100, 50);

-- Chapter 3: L'Éveil du Réseau (2 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab020301-0000-0000-0000-000000000000', 'ac020003-0000-0000-0000-000000000000', 'nexus-indien', 'Le Nexus Indien',
   'Le sol se fissure. Les cristaux vibrent à l''unisson. Le Nexus Indien émerge des profondeurs — un cristal colossal connecté à des milliers de filons. Sa lumière baigne les plateaux entiers d''une lueur émeraude.',
   'Le Nexus Indien est un nœud majeur du réseau planétaire. Son activation signifie que le réseau prend conscience — ou que quelqu''un l''a réveillé.',
   ARRAY['cc200006-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab020302-0000-0000-0000-000000000000', 'ac020003-0000-0000-0000-000000000000', 'eveil-final', 'L''Éveil',
   'Le Nexus te regarde — non, il te SENT. Dans sa lumière, tu perçois le réseau planétaire dans son ensemble. Madagascar, l''Inde, la Sibérie... tous connectés. Tous éveillés. L''oracle avait raison : le réseau a un message. Et ce message, c''est toi qui dois le déchiffrer.',
   'L''Éveil du Réseau n''est pas un événement — c''est un processus. Le réseau planétaire prend conscience, lentement, nœud par nœud. Et il cherche quelqu''un capable de l''écouter.',
   '{}'::UUID[], 'ab020301-0000-0000-0000-000000000000', 2, 200, 0, 200, 100);

-- ── ARC 3: Abysses Cristallines ──

-- Chapter 1: Descente dans les Mines (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab030101-0000-0000-0000-000000000000', 'ac030001-0000-0000-0000-000000000000', 'mineur', 'Le Mineur',
   'Le mineur des abysses t''attend à l''entrée du puits principal. Sa lampe frontale éclaire des parois scintillantes. "Les mines de Sibérie descendent plus profond que tout ce que tu imagines. Suis-moi, et ne touche pas aux cristaux luminescents."',
   'Les mines de Sibérie furent creusées par les Profonds quand ils suivirent les filons cristallins toujours plus bas. À ces profondeurs, les cristaux sont plus purs — et plus dangereux.',
   ARRAY['cc300001-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab030102-0000-0000-0000-000000000000', 'ac030001-0000-0000-0000-000000000000', 'luminescent', 'L''Abysse Lumineuse',
   'Des cristaux luminescents illuminent les galeries d''une lueur irréelle. Leurs pulsations tracent des motifs hypnotiques sur les murs. "Ne les fixe pas trop longtemps," prévient le mineur. "Ils absorbent l''attention avant la conscience."',
   NULL,
   ARRAY['cc300002-0000-0000-0000-000000000000']::UUID[], 'ab030101-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab030103-0000-0000-0000-000000000000', 'ac030001-0000-0000-0000-000000000000', 'pilleur', 'Le Pilleur',
   'Un pilleur de filons émerge d''une galerie latérale. "Vous descendez plus bas ? J''ai un ascenseur de fortune. Mais faudra payer." Son sourire révèle des dents teintées de cristal.',
   NULL,
   ARRAY['cc300003-0000-0000-0000-000000000000']::UUID[], 'ab030102-0000-0000-0000-000000000000', 3, 400, 0, 40, 15);

-- Chapter 2: Les Cristaux Profonds (4 nodes with choice)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab030201-0000-0000-0000-000000000000', 'ac030002-0000-0000-0000-000000000000', 'voix', 'La Voix de la Roche',
   'La voix de la roche résonne dans les galeries profondes. Son chant est un mélange de beauté et de puissance. "Descends... plus profond... les cristaux t''appellent." La roche vibre en harmonie.',
   NULL,
   ARRAY['cc300004-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0);

INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, is_choice, choice_label, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab030202-0000-0000-0000-000000000000', 'ac030002-0000-0000-0000-000000000000', 'blinde-path', 'Le Blindé',
   'Tu empruntes le blindé des profondeurs. Sa coque cristalline résiste à la pression écrasante. Les parois des galeries scintillent de cristaux inconnus — des variétés que même les Gardiens n''ont jamais cataloguées.',
   NULL,
   ARRAY['cc300005-0000-0000-0000-000000000000']::UUID[], 'ab030201-0000-0000-0000-000000000000', true, 'Emprunter le blindé des profondeurs', 2, 200, -60, 0, 0),

  ('ab030203-0000-0000-0000-000000000000', 'ac030002-0000-0000-0000-000000000000', 'filon-path', 'Le Filon Ancestral',
   'Tu affrontes le filon ancestral. Ses cristaux pulsent d''une énergie inconnue. La résonance est si forte qu''elle fait vibrer tes os. Le mineur recule. "Ce filon est vivant..."',
   'Les filons ancestraux sont les plus anciens cristaux connus. Leur résonance est si puissante qu''elle altère la réalité autour d''eux.',
   ARRAY['cc300006-0000-0000-0000-000000000000']::UUID[], 'ab030201-0000-0000-0000-000000000000', true, 'Explorer le filon ancestral', 3, 200, 60, 0, 0);

INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab030204-0000-0000-0000-000000000000', 'ac030002-0000-0000-0000-000000000000', 'spectre', 'Le Spectre des Mines',
   'Le spectre des mines apparaît, silhouette cristalline d''un ancien mineur. "Vous avez prouvé votre valeur dans mes galeries. Peu y parviennent." Il pointe vers le bas. "Le Nexus vous attend. Et ce qui dort en dessous."',
   NULL,
   ARRAY['cc300007-0000-0000-0000-000000000000']::UUID[], 'ab030202-0000-0000-0000-000000000000', 4, 400, 0, 80, 30);

-- Chapter 3: Le Nexus (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab030301-0000-0000-0000-000000000000', 'ac030003-0000-0000-0000-000000000000', 'hydre', 'L''Hydre Cristalline',
   'L''hydre cristalline garde le passage vers le Nexus. Ses multiples branches s''agitent dans l''obscurité, chacune émettant une fréquence différente. "Personne ne passe," résonne leur chœur cristallin.',
   NULL,
   ARRAY['cc300008-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab030302-0000-0000-0000-000000000000', 'ac030003-0000-0000-0000-000000000000', 'gardien', 'Le Gardien des Abysses',
   'Le Gardien des Abysses trône dans une caverne tapissée de cristaux noirs. Son regard est ancien, patient. "Le Nexus n''est pas une arme. C''est un message. Es-tu prêt à l''entendre ?"',
   'Le Gardien des Abysses protège le Nexus depuis des millénaires. Il ne juge pas — il teste. Seuls ceux qui comprennent le cristal peuvent accéder au Nexus.',
   ARRAY['cc300009-0000-0000-0000-000000000000']::UUID[], 'ab030301-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab030303-0000-0000-0000-000000000000', 'ac030003-0000-0000-0000-000000000000', 'coeur-siberie', 'Le Cœur de Sibérie',
   'Au fond de tout. Dans les ténèbres cristallines. Le Cœur de Sibérie pulse d''une énergie qui fait trembler le continent. C''est le Nexus — le point de convergence du réseau planétaire. Sa lumière est aveuglante, son message est clair : le réseau veut être activé. Par toi.',
   'Le Cœur de Sibérie est le Nexus Planétaire. Le point où tous les filons convergent. Celui qui le touche accède à la mémoire de la Terre — et à la vérité sur les cristaux.',
   ARRAY['cc300010-0000-0000-0000-000000000000']::UUID[], 'ab030302-0000-0000-0000-000000000000', 3, 400, 0, 200, 100);

-- ── ARC 4: La Guerre des Cristaux ──
-- Uses base cards

DO $$
DECLARE
  agent_extraction_id UUID;
  mineur_eclaireur_id UUID;
  chercheur_itinerant_id UUID;
  initie_ordre_id UUID;
  raffinerie_mobile_id UUID;
  brouilleur_cristallin_id UUID;
  camp_recherche_id UUID;
  salle_conseil_id UUID;
  protocole_confinement_id UUID;
  forteresse_souterraine_id UUID;
  geologue_veteran_id UUID;
  doyenne_nyra_id UUID;
  codex_origines_id UUID;
  nexus_planetaire_id UUID;
BEGIN
  SELECT id INTO agent_extraction_id FROM cards WHERE name = 'Agent d''Extraction';
  SELECT id INTO mineur_eclaireur_id FROM cards WHERE name = 'Mineur Éclaireur';
  SELECT id INTO chercheur_itinerant_id FROM cards WHERE name = 'Chercheur Itinérant';
  SELECT id INTO initie_ordre_id FROM cards WHERE name = 'Initié de l''Ordre';
  SELECT id INTO raffinerie_mobile_id FROM cards WHERE name = 'Raffinerie Mobile';
  SELECT id INTO brouilleur_cristallin_id FROM cards WHERE name = 'Brouilleur Cristallin';
  SELECT id INTO camp_recherche_id FROM cards WHERE name = 'Camp de Recherche';
  SELECT id INTO salle_conseil_id FROM cards WHERE name = 'Salle du Conseil';
  SELECT id INTO protocole_confinement_id FROM cards WHERE name = 'Protocole de Confinement';
  SELECT id INTO forteresse_souterraine_id FROM cards WHERE name = 'Forteresse Souterraine';
  SELECT id INTO geologue_veteran_id FROM cards WHERE name = 'Géologue Vétéran';
  SELECT id INTO doyenne_nyra_id FROM cards WHERE name = 'La Doyenne Nyra';
  SELECT id INTO codex_origines_id FROM cards WHERE name = 'Codex des Origines';
  SELECT id INTO nexus_planetaire_id FROM cards WHERE name = 'Nexus Planétaire';

  -- Chapter 1: Les Émissaires (4 nodes)
  INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
    ('ab040101-0000-0000-0000-000000000000', 'ac040001-0000-0000-0000-000000000000', 'agent-consortium', 'L''Agent du Consortium',
     'Un agent d''extraction du Consortium te convoque. "Les quatre factions doivent se réunir. Un signal cristallin massif a été détecté — un signal venu des profondeurs." Son regard est grave.',
     NULL,
     ARRAY[agent_extraction_id], NULL, 1, 0, 0, 0, 0),

    ('ab040102-0000-0000-0000-000000000000', 'ac040001-0000-0000-0000-000000000000', 'mineur-emissaire', 'Le Mineur Messager',
     'Un mineur éclaireur des Profonds apporte un message de Nyra. "Les galeries résonnent depuis trois jours. Le réseau s''éveille." Il dépose un cristal-mémoire et disparaît dans les tunnels.',
     NULL,
     ARRAY[mineur_eclaireur_id], 'ab040101-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

    ('ab040103-0000-0000-0000-000000000000', 'ac040001-0000-0000-0000-000000000000', 'chercheur-alliance', 'L''Alliance',
     'Un chercheur itinérant des Gardiens arrive, couvert de poussière cristalline. "Les Gardiens veulent la paix. Le réseau ne doit pas être une arme." Il tend la main. Derrière lui, d''autres scientifiques attendent.',
     NULL,
     ARRAY[chercheur_itinerant_id], 'ab040102-0000-0000-0000-000000000000', 3, 400, 0, 0, 0),

    ('ab040104-0000-0000-0000-000000000000', 'ac040001-0000-0000-0000-000000000000', 'initie-signal', 'Le Signal Ancien',
     'L''initié de l''Ordre déchiffre le signal cristallin. Ses yeux s''écarquillent. "Le Codex avait raison... Le réseau n''est pas naturel. Et il se réveille. Les quatre clés des factions sont nécessaires pour le Nexus."',
     'Un signal cristallin ancien a été détecté, émis depuis le Nexus Planétaire. Le message contient les instructions pour activer — ou désactiver — le réseau. Mais il faut la coopération des quatre factions.',
     ARRAY[initie_ordre_id], 'ab040103-0000-0000-0000-000000000000', 4, 600, 0, 60, 25);

  -- Chapter 2: Les Reliques (4 nodes with choice)
  INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
    ('ab040201-0000-0000-0000-000000000000', 'ac040002-0000-0000-0000-000000000000', 'raffinerie', 'La Raffinerie',
     'La raffinerie mobile du Consortium est la première clé. Cachée dans un complexe fortifié, elle peut canaliser l''énergie cristalline sur des kilomètres. "Si on l''active ici, c''est tout le réseau local qui en profite," explique l''agent.',
     NULL,
     ARRAY[raffinerie_mobile_id], NULL, 1, 0, 0, 0, 0);

  INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, is_choice, choice_label, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
    ('ab040202-0000-0000-0000-000000000000', 'ac040002-0000-0000-0000-000000000000', 'brouilleur-path', 'Le Brouilleur',
     'Tu utilises le brouilleur cristallin pour couper les communications du Consortium. Dans le silence, la vérité émerge : le Consortium cachait l''existence du Nexus depuis des années.',
     'Les Profonds ont brouillé le réseau du Consortium. Le silence cristallin est leur première arme. Sans communication, les mensonges ne se propagent plus.',
     ARRAY[brouilleur_cristallin_id], 'ab040201-0000-0000-0000-000000000000', true, 'Utiliser le brouilleur cristallin', 2, 200, -60, 0, 0),

    ('ab040203-0000-0000-0000-000000000000', 'ac040002-0000-0000-0000-000000000000', 'camp-path', 'Le Camp',
     'Tu défends le camp de recherche des Gardiens contre une incursion du Consortium. Les instruments tiennent, les données sont sauvées. Depuis le camp, tu repères un convoi transportant une relique cristalline.',
     'Le camp de recherche a résisté à l''assaut. La science ne recule pas devant la force.',
     ARRAY[camp_recherche_id], 'ab040201-0000-0000-0000-000000000000', true, 'Défendre le camp de recherche', 3, 200, 60, 0, 0);

  INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
    ('ab040204-0000-0000-0000-000000000000', 'ac040002-0000-0000-0000-000000000000', 'convergence-4', 'La Convergence',
     'Les informations des deux chemins convergent. Le Nexus Planétaire est réel, et les quatre reliques cristallines doivent être réunies pour l''activer. L''heure du dénouement approche.',
     NULL,
     '{}'::UUID[], 'ab040202-0000-0000-0000-000000000000', 4, 400, 0, 100, 40);

  -- Chapter 3: Le Dénouement (5 nodes)
  INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
    ('ab040301-0000-0000-0000-000000000000', 'ac040003-0000-0000-0000-000000000000', 'salle-conseil', 'La Salle du Conseil',
     'La salle du conseil s''ouvre. Les quatre représentants des factions se font face pour la première fois. La tension cristalline est palpable. Sur la table, les reliques pulsent en harmonie.',
     NULL,
     ARRAY[salle_conseil_id], NULL, 1, 0, 0, 0, 0),

    ('ab040302-0000-0000-0000-000000000000', 'ac040003-0000-0000-0000-000000000000', 'protocole', 'Le Protocole',
     'Le protocole de confinement est activé ! Les alarmes résonnent dans les cristaux. Quelqu''un a tenté de prendre le contrôle du réseau. "Ce n''est pas nous !" crie le mineur. L''agent du Consortium court vers les contrôles.',
     NULL,
     ARRAY[protocole_confinement_id], 'ab040301-0000-0000-0000-000000000000', 2, 150, 0, 0, 0),

    ('ab040303-0000-0000-0000-000000000000', 'ac040003-0000-0000-0000-000000000000', 'forteresse', 'La Forteresse',
     'La forteresse souterraine révèle ses secrets : un passage oublié mène directement au Nexus. Les Profonds connaissaient ce passage depuis toujours. "On attendait le bon moment," dit Nyra.',
     NULL,
     ARRAY[forteresse_souterraine_id], 'ab040302-0000-0000-0000-000000000000', 3, 300, 0, 0, 0),

    ('ab040304-0000-0000-0000-000000000000', 'ac040003-0000-0000-0000-000000000000', 'doyenne', 'La Doyenne',
     'La Doyenne Nyra se dresse devant les factions. "Si le réseau ne profite pas à tous, il ne profitera à personne." Sa voix porte dans chaque cristal. Les factions se regardent. Elle a raison. C''est tout le monde ou personne.',
     'La Doyenne Nyra a découvert le réseau la première. Sa sagesse et sa détermination sont les seules forces capables d''unir les factions.',
     ARRAY[doyenne_nyra_id], 'ab040303-0000-0000-0000-000000000000', 4, 450, 0, 0, 0),

    ('ab040305-0000-0000-0000-000000000000', 'ac040003-0000-0000-0000-000000000000', 'nexus-final', 'Le Nexus',
     'Le Codex des Origines ou le Nexus Planétaire — l''une des deux reliques contient la dernière clé. Tu l''actives. Les cristaux fusionnent, le réseau planétaire se déploie. La Terre tremble. Pour la première fois depuis des millénaires, le réseau est complet. Son message résonne dans chaque cristal : "Nous sommes prêts."',
     'Le secret du réseau cristallin. Les cristaux ne sont pas naturels — ils sont un message, laissé par une intelligence qui attendait que l''humanité soit prête. Le message est simple : vous n''êtes pas seuls.',
     '{}'::UUID[], 'ab040304-0000-0000-0000-000000000000', 5, 600, 0, 500, 200);

  -- Update the final node to use required_any_cards for the OR condition
  UPDATE story_nodes
  SET required_any_cards = ARRAY[codex_origines_id, nexus_planetaire_id]
  WHERE id = 'ab040305-0000-0000-0000-000000000000';
END $$;

-- ============================================
-- EXPLORATION MISSIONS (21 — 7 per region)
-- ============================================

-- Géode de Madagascar (neon_ruins)
INSERT INTO exploration_missions (region, title, description, condition_type, condition_value, condition_faction, reward_gems, reward_xp, sort_order, icon) VALUES
  ('neon_ruins', 'Premiers Cristaux', 'Collectionnez 2 cartes de l''Ordre Ancien.', 'collect_faction_cards', 2, 'tech_scavengers', 30, 20, 1, '💎'),
  ('neon_ruins', 'Écho des Galeries', 'Collectionnez 2 cartes des Profonds.', 'collect_faction_cards', 2, 'underground_resistance', 30, 20, 2, '🔊'),
  ('neon_ruins', 'Chasseur de Reliques', 'Obtenez 1 carte rare+ de l''Ordre Ancien.', 'collect_faction_rarity', 3, 'tech_scavengers', 60, 40, 3, '🏆'),
  ('neon_ruins', 'Prospecteur Assidu', 'Ouvrez 3 boosters Ordre Ancien.', 'open_faction_boosters', 3, 'tech_scavengers', 50, 30, 4, '📦'),
  ('neon_ruins', 'Archiviste de la Géode', 'Découvrez 2 entrées de codex de la région.', 'discover_region_codex', 2, NULL, 80, 50, 5, '📖'),
  ('neon_ruins', 'Maîtrise Cristalline', 'Collectionnez toutes les cartes communes de l''Ordre Ancien.', 'collect_all_faction_rarity', 1, 'tech_scavengers', 100, 60, 6, '⭐'),
  ('neon_ruins', 'Légende de la Géode', 'Complétez l''arc narratif de la Géode de Madagascar.', 'complete_story_arc', 1, NULL, 200, 120, 7, '👑');

-- Plateaux de l'Inde (ash_desert)
INSERT INTO exploration_missions (region, title, description, condition_type, condition_value, condition_faction, reward_gems, reward_xp, sort_order, icon) VALUES
  ('ash_desert', 'Sentier des Chercheurs', 'Collectionnez 2 cartes des Gardiens du Réseau.', 'collect_faction_cards', 2, 'surface_survivors', 30, 20, 1, '🔬'),
  ('ash_desert', 'Expert de Terrain', 'Collectionnez 4 cartes des Gardiens du Réseau.', 'collect_faction_cards', 4, 'surface_survivors', 50, 30, 2, '🗺️'),
  ('ash_desert', 'Cristal Rare', 'Obtenez 1 carte rare+ des Gardiens.', 'collect_faction_rarity', 3, 'surface_survivors', 60, 40, 3, '💎'),
  ('ash_desert', 'Fournisseur de Données', 'Ouvrez 3 boosters Gardiens du Réseau.', 'open_faction_boosters', 3, 'surface_survivors', 50, 30, 4, '📊'),
  ('ash_desert', 'Prophéties Cristallines', 'Découvrez 2 entrées de codex de la région.', 'discover_region_codex', 2, NULL, 80, 50, 5, '📜'),
  ('ash_desert', 'Dominateur des Plateaux', 'Collectionnez toutes les cartes communes des Gardiens.', 'collect_all_faction_rarity', 1, 'surface_survivors', 100, 60, 6, '🏔️'),
  ('ash_desert', 'Légende des Plateaux', 'Complétez l''arc narratif des Plateaux de l''Inde.', 'complete_story_arc', 1, NULL, 200, 120, 7, '👑');

-- Abysses de Sibérie (toxic_ocean)
INSERT INTO exploration_missions (region, title, description, condition_type, condition_value, condition_faction, reward_gems, reward_xp, sort_order, icon) VALUES
  ('toxic_ocean', 'Descente Initiale', 'Collectionnez 2 cartes des Profonds.', 'collect_faction_cards', 2, 'underground_resistance', 30, 20, 1, '⛏️'),
  ('toxic_ocean', 'Explorateur des Abysses', 'Collectionnez 5 cartes des Profonds.', 'collect_faction_cards', 5, 'underground_resistance', 50, 30, 2, '🕳️'),
  ('toxic_ocean', 'Trophée Profond', 'Obtenez 1 carte épique+ des Profonds.', 'collect_faction_rarity', 4, 'underground_resistance', 80, 50, 3, '🏆'),
  ('toxic_ocean', 'Ravitaillement Minier', 'Ouvrez 3 boosters Les Profonds.', 'open_faction_boosters', 3, 'underground_resistance', 50, 30, 4, '📦'),
  ('toxic_ocean', 'Secrets des Profondeurs', 'Découvrez 2 entrées de codex de la région.', 'discover_region_codex', 2, NULL, 80, 50, 5, '🔮'),
  ('toxic_ocean', 'Collection Abyssale', 'Collectionnez toutes les cartes communes des Profonds.', 'collect_all_faction_rarity', 1, 'underground_resistance', 100, 60, 6, '⭐'),
  ('toxic_ocean', 'Légende des Abysses', 'Complétez l''arc narratif des Abysses de Sibérie.', 'complete_story_arc', 1, NULL, 200, 120, 7, '👑');

-- ============================================
-- NARRATIVE EVENTS (3)
-- ============================================

INSERT INTO narrative_events (id, slug, title, description, narrative_text, image_url, starts_at, ends_at, reward_gems, reward_xp, is_active, winning_choice_id) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'course-nexus', 'La Course au Nexus',
   'Un signal cristallin massif a été détecté sous Madagascar. Chaque faction veut l''atteindre en premier.',
   'Le réseau cristallin de Madagascar émet un signal d''une puissance jamais enregistrée. Les instruments des Gardiens s''affolent, les rituels de l''Ordre résonnent en harmonie, et les Profonds sentent la roche vibrer dans leurs galeries. Chaque faction mobilise ses forces pour atteindre la source du signal en premier.',
   NULL, '2026-02-01T00:00:00Z', '2026-03-01T00:00:00Z', 75, 40, true, NULL),

  ('e1000000-0000-0000-0000-000000000002', 'vol-codex', 'Le Vol du Codex',
   'Le Codex des Origines a été volé dans un sanctuaire de l''Ordre Ancien.',
   'Le sanctuaire principal de l''Ordre Ancien a été profané. Le Codex des Origines — le texte le plus sacré de l''Ordre, celui qui révèle la vérité sur les cristaux — a disparu. Les soupçons se portent sur chaque faction. La tension monte.',
   NULL, '2026-01-01T00:00:00Z', '2026-01-31T00:00:00Z', 50, 25, false, NULL),

  ('e1000000-0000-0000-0000-000000000003', 'eveil-planetaire', 'L''Éveil Planétaire',
   'Le réseau cristallin montre des signes d''activité autonome. Faut-il l''activer ou le contenir ?',
   'Les trois Nexus — Madagascar, Inde, Sibérie — émettent simultanément. Le réseau cristallin planétaire montre des signes d''activité autonome pour la première fois. Des messages incohérents circulent dans les cristaux. Le réseau tente de communiquer. Faut-il l''aider, ou le contenir avant qu''il ne soit trop tard ?',
   NULL, '2026-03-15T00:00:00Z', '2026-04-15T00:00:00Z', 100, 50, true, NULL);

-- Event 1: La Course au Nexus
INSERT INTO event_choices (id, event_id, faction, label, description, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'dome_dwellers',
   'Envoyer une force d''extraction armée', 'Le Consortium mobilise ses meilleurs agents et ses drones foreuses pour atteindre la source du signal.', 0),
  ('c1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 'underground_resistance',
   'Utiliser les tunnels secrets', 'Les Profonds empruntent des galeries non cartographiées pour devancer les autres factions.', 1),
  ('c1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', 'tech_scavengers',
   'Activer un rituel de résonance', 'L''Ordre Ancien utilise ses chants ancestraux pour localiser la source avec précision.', 2);

-- Event 2: Le Vol du Codex
INSERT INTO event_choices (id, event_id, faction, label, description, sort_order) VALUES
  ('c2000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000002', 'dome_dwellers',
   'Enquête officielle du Consortium', 'Le Consortium lance une enquête avec ses agents de sécurité. Méthode efficace mais brutale.', 0),
  ('c2000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000002', 'underground_resistance',
   'Opération clandestine de récupération', 'Les Profonds infiltrent les suspects pour retrouver le Codex en secret.', 1),
  ('c2000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000002', 'surface_survivors',
   'Médiation scientifique', 'Les Gardiens proposent une médiation neutre et une analyse cristalline des preuves.', 2);

-- Set winning choice for event 2
UPDATE narrative_events SET winning_choice_id = 'c2000000-0000-0000-0000-000000000002' WHERE id = 'e1000000-0000-0000-0000-000000000002';

-- Event 3: L'Éveil Planétaire
INSERT INTO event_choices (id, event_id, faction, label, description, sort_order) VALUES
  ('c3000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000003', 'underground_resistance',
   'Amplifier le signal cristallin', 'Les Profonds veulent amplifier le signal pour aider le réseau à communiquer.', 0),
  ('c3000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000003', 'tech_scavengers',
   'Effectuer le rituel d''activation', 'L''Ordre Ancien propose d''utiliser le rituel complet de résonance pour activer le réseau.', 1),
  ('c3000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000003', 'surface_survivors',
   'Étudier avant de décider', 'Les Gardiens insistent pour étudier le phénomène avant toute action irréversible.', 2);

-- ============================================
-- END OF MIGRATION
-- ============================================
