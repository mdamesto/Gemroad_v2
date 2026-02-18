-- ============================================
-- GemRoad - Migration 008: Chronicles (Narrative Adventure)
-- ============================================

-- ============================================
-- NEW CARDS FOR ARCS 1-3 (24 cards)
-- Arc 4 uses existing cards from migration 003
-- ============================================

-- Arc 1: Ruines de Néon (8 cards)
INSERT INTO cards (id, name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('cc100001-0000-0000-0000-000000000000', 'Éclaireur Néon', 'Un survivant qui arpente les ruines illuminées de néon.', '/images/cards/eclaireur-neon.svg', 'common', NULL, 3, 2, 'Les ruines de néon étaient autrefois le quartier technologique de la mégapole.', 'character', 'tech_scavengers'),
  ('cc100002-0000-0000-0000-000000000000', 'Sentinelle Rouillée', 'Automate de défense à moitié fonctionnel.', '/images/cards/sentinelle-rouillee.svg', 'common', NULL, 2, 4, 'Elle ne distingue plus les amis des ennemis. Mieux vaut rester prudent.', 'character', 'tech_scavengers'),
  ('cc100003-0000-0000-0000-000000000000', 'Chasseur de Fragments', 'Spécialiste de la récupération de données anciennes.', '/images/cards/chasseur-fragments.svg', 'uncommon', NULL, 4, 3, 'Les fragments sont les clés de mémoire de l''ancien réseau.', 'character', 'tech_scavengers'),
  ('cc100004-0000-0000-0000-000000000000', 'Marchande d''Ombres', 'Trafiquante d''artefacts dans le marché noir des ruines.', '/images/cards/marchande-ombres.svg', 'uncommon', NULL, 3, 3, 'Son commerce prospère là où la lumière ne va pas.', 'character', 'underground_resistance'),
  ('cc100005-0000-0000-0000-000000000000', 'Golem de Câbles', 'Créature née de la foudre et des câbles emmêlés.', '/images/cards/golem-cables.svg', 'rare', NULL, 6, 5, 'Les golems de câbles sont nés quand la foudre a frappé la centrale détruite.', 'character', 'tech_scavengers'),
  ('cc100006-0000-0000-0000-000000000000', 'Spectre Holographique', 'Écho lumineux d''un ancien dirigeant.', '/images/cards/spectre-holographique.svg', 'rare', NULL, 4, 4, 'Le spectre répète le discours d''un ancien dirigeant. Personne ne sait s''il est conscient.', 'character', 'tech_scavengers'),
  ('cc100007-0000-0000-0000-000000000000', 'Archonte du Néon', 'Seigneur autoproclamé des ruines lumineuses.', '/images/cards/archonte-neon.svg', 'epic', NULL, 7, 6, 'Il règne sur un empire de décombres et de lumière morte.', 'character', 'tech_scavengers'),
  ('cc100008-0000-0000-0000-000000000000', 'Titan Chrome', 'Colosse mécanique, dernier projet d''une IA démente.', '/images/cards/titan-chrome.svg', 'legendary', NULL, 9, 8, 'Le Titan Chrome serait le dernier projet d''une IA devenue folle — ou devenue libre.', 'character', 'tech_scavengers');

-- Arc 2: Désert de Cendres (6 cards)
INSERT INTO cards (id, name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('cc200001-0000-0000-0000-000000000000', 'Nomade des Cendres', 'Voyageur solitaire du désert post-apocalyptique.', '/images/cards/nomade-cendres.svg', 'common', NULL, 3, 3, 'Le désert de cendres s''étend sur ce qui était autrefois l''Europe centrale.', 'character', 'surface_survivors'),
  ('cc200002-0000-0000-0000-000000000000', 'Scorpion Mutant', 'Prédateur blindé du désert de cendres.', '/images/cards/scorpion-mutant.svg', 'common', NULL, 4, 3, 'Sa carapace a absorbé tant de radiation qu''elle brille la nuit.', 'character', 'surface_survivors'),
  ('cc200003-0000-0000-0000-000000000000', 'Prophète du Sable', 'Mystique errant qui lit l''avenir dans les cendres.', '/images/cards/prophete-sable.svg', 'uncommon', NULL, 3, 4, 'Les prophéties du sable mentionnent un Grand Éveil — personne ne sait si c''est une promesse ou une menace.', 'character', 'surface_survivors'),
  ('cc200004-0000-0000-0000-000000000000', 'Colosse de Rouille', 'Géant mécanique corrodé qui erre dans le désert.', '/images/cards/colosse-rouille.svg', 'rare', NULL, 6, 6, 'Chaque pas fait trembler le sable sur des centaines de mètres.', 'character', 'surface_survivors'),
  ('cc200005-0000-0000-0000-000000000000', 'Reine des Tempêtes', 'Souveraine des tempêtes de sable dévastatrices.', '/images/cards/reine-tempetes.svg', 'epic', NULL, 7, 5, 'Quand la Reine danse, le sable se soulève en spirales visibles à des kilomètres.', 'character', 'surface_survivors'),
  ('cc200006-0000-0000-0000-000000000000', 'Léviathan Enseveli', 'Créature titanesque enfouie sous les cendres depuis des siècles.', '/images/cards/leviathan-enseveli.svg', 'legendary', NULL, 10, 9, 'Le Léviathan dort depuis des siècles. Son réveil signifie la fin de toute vie restante — ou un nouveau commencement.', 'character', 'surface_survivors');

-- Arc 3: Océan Toxique (10 cards)
INSERT INTO cards (id, name, description, image_url, rarity, series_id, attack, defense, lore, type, faction) VALUES
  ('cc300001-0000-0000-0000-000000000000', 'Plongeur Aveugle', 'Guide des profondeurs qui a sacrifié sa vue pour survivre.', '/images/cards/plongeur-aveugle.svg', 'common', NULL, 2, 3, 'L''océan toxique couvre 40% de ce qui reste de la surface. Personne ne sait ce qui vit au fond.', 'character', 'underground_resistance'),
  ('cc300002-0000-0000-0000-000000000000', 'Méduse Radioactive', 'Créature luminescente des eaux empoisonnées.', '/images/cards/meduse-radioactive.svg', 'common', NULL, 3, 2, 'Leur lumière attire les imprudents vers une mort lente.', 'character', 'underground_resistance'),
  ('cc300003-0000-0000-0000-000000000000', 'Pirate des Récifs', 'Pillard des épaves englouties dans l''océan toxique.', '/images/cards/pirate-recifs.svg', 'common', NULL, 4, 2, 'Là où d''autres voient un cimetière marin, il voit un trésor.', 'character', 'underground_resistance'),
  ('cc300004-0000-0000-0000-000000000000', 'Sirène Corrompue', 'Être mi-humain mi-aquatique, transformé par la pollution.', '/images/cards/sirene-corrompue.svg', 'uncommon', NULL, 4, 3, 'Son chant promettait la beauté. La réalité est bien plus terrifiante.', 'character', 'underground_resistance'),
  ('cc300005-0000-0000-0000-000000000000', 'Requin Blindé', 'Prédateur marin dont les écailles sont devenues métalliques.', '/images/cards/requin-blinde.svg', 'uncommon', NULL, 5, 4, 'L''évolution a remplacé le cartilage par de l''acier. La nature improvise.', 'character', 'underground_resistance'),
  ('cc300006-0000-0000-0000-000000000000', 'Kraken de Pétrole', 'Monstre marin vivant dans les nappes de pétrole toxique.', '/images/cards/kraken-petrole.svg', 'rare', NULL, 7, 5, 'Les krakens vivent dans les nappes de pétrole toxique. Leurs tentacules s''étendent sur des kilomètres.', 'character', 'underground_resistance'),
  ('cc300007-0000-0000-0000-000000000000', 'Amiral Fantôme', 'Spectre d''un commandant naval d''avant la catastrophe.', '/images/cards/amiral-fantome.svg', 'rare', NULL, 5, 6, 'Il commande encore sa flotte. Personne n''ose lui dire que ses navires ont coulé.', 'character', 'underground_resistance'),
  ('cc300008-0000-0000-0000-000000000000', 'Hydre Abyssale', 'Créature multi-têtes des profondeurs corrompues.', '/images/cards/hydre-abyssale.svg', 'epic', NULL, 8, 6, 'Chaque tête pense indépendamment. Elles ne sont jamais d''accord, sauf pour tuer.', 'character', 'underground_resistance'),
  ('cc300009-0000-0000-0000-000000000000', 'Poseidon Corrompu', 'L''ancien dieu des mers transformé par la pollution.', '/images/cards/poseidon-corrompu.svg', 'epic', NULL, 8, 7, 'L''ancien dieu des mers, transformé par la pollution. Il ne protège plus — il punit.', 'character', 'underground_resistance'),
  ('cc300010-0000-0000-0000-000000000000', 'Abomination des Abysses', 'La chose innommable qui vit au fond de l''océan toxique.', '/images/cards/abomination-abysses.svg', 'legendary', NULL, 10, 10, 'La chose qui vit tout au fond. Personne n''a survécu pour la décrire. Jusqu''à toi.', 'character', 'underground_resistance');

-- ============================================
-- STORY TABLES
-- ============================================

CREATE TABLE story_arcs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  region TEXT,
  faction TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE story_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arc_id UUID NOT NULL REFERENCES story_arcs(id),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  reward_gems INT DEFAULT 0,
  reward_xp INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE story_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES story_chapters(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  narrative_text TEXT NOT NULL,
  codex_entry TEXT,
  required_cards UUID[] DEFAULT '{}',
  required_any_cards UUID[] DEFAULT '{}',
  parent_node_id UUID REFERENCES story_nodes(id),
  is_choice BOOLEAN DEFAULT false,
  choice_label TEXT,
  reward_gems INT DEFAULT 0,
  reward_xp INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  pos_x INT DEFAULT 0,
  pos_y INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_story_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  node_id UUID NOT NULL REFERENCES story_nodes(id),
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, node_id)
);

CREATE TABLE user_codex (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  node_id UUID NOT NULL REFERENCES story_nodes(id),
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, node_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_story_nodes_chapter ON story_nodes(chapter_id);
CREATE INDEX idx_user_story_user ON user_story_progress(user_id);
CREATE INDEX idx_user_codex_user ON user_codex(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE story_arcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_story_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_codex ENABLE ROW LEVEL SECURITY;

CREATE POLICY "story_arcs_read" ON story_arcs FOR SELECT TO authenticated USING (true);
CREATE POLICY "story_chapters_read" ON story_chapters FOR SELECT TO authenticated USING (true);
CREATE POLICY "story_nodes_read" ON story_nodes FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_story_read" ON user_story_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_story_insert" ON user_story_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_codex_read" ON user_codex FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_codex_insert" ON user_codex FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SEED: STORY ARCS (4)
-- ============================================

INSERT INTO story_arcs (id, slug, name, description, region, faction, image_url, sort_order) VALUES
  ('aa000001-0000-0000-0000-000000000000', 'lumieres-mourantes', 'Les Lumières Mourantes', 'Dans les ruines baignées de néon, les échos du passé guident ceux qui osent écouter.', 'neon_ruins', NULL, NULL, 1),
  ('aa000002-0000-0000-0000-000000000000', 'sables-et-propheties', 'Sables et Prophéties', 'Dans le désert de cendres, seuls les prophètes et les fous survivent. Parfois c''est la même chose.', 'ash_desert', NULL, NULL, 2),
  ('aa000003-0000-0000-0000-000000000000', 'abysses-corrompues', 'Abysses Corrompues', 'L''océan ne pardonne pas. L''océan n''oublie pas. L''océan attend.', 'toxic_ocean', NULL, NULL, 3),
  ('aa000004-0000-0000-0000-000000000000', 'guerre-des-factions', 'La Guerre des Factions', 'Quatre factions. Un monde brisé. Un seul pourra le reconstruire.', NULL, NULL, NULL, 4);

-- ============================================
-- SEED: STORY CHAPTERS (12)
-- ============================================

-- Arc 1 chapters
INSERT INTO story_chapters (id, arc_id, slug, name, description, sort_order, reward_gems, reward_xp) VALUES
  ('ac010001-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000000', 'premiers-pas', 'Premiers Pas dans les Ruines', 'Les néons clignotent encore dans les décombres du vieux monde.', 1, 50, 20),
  ('ac010002-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000000', 'marche-ombres', 'Le Marché des Ombres', 'Un marché clandestin où se négocient les secrets du passé.', 2, 80, 30),
  ('ac010003-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000000', 'seigneur-neon', 'Le Seigneur du Néon', 'Au sommet des ruines, un titan attend depuis des siècles.', 3, 200, 100);

-- Arc 2 chapters
INSERT INTO story_chapters (id, arc_id, slug, name, description, sort_order, reward_gems, reward_xp) VALUES
  ('ac020001-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000000', 'la-traversee', 'La Traversée', 'Le vent de cendres brûle les poumons et aveugle les yeux.', 1, 50, 20),
  ('ac020002-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000000', 'forteresse-rouillee', 'La Forteresse Rouillée', 'Une forteresse oubliée se dresse au milieu des dunes.', 2, 100, 50),
  ('ac020003-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000000', 'eveil', 'L''Éveil', 'Quelque chose de colossal remue sous les cendres.', 3, 200, 100);

-- Arc 3 chapters
INSERT INTO story_chapters (id, arc_id, slug, name, description, sort_order, reward_gems, reward_xp) VALUES
  ('ac030001-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000000', 'plongee-noir', 'Plongée dans le Noir', 'Les eaux noires cachent des horreurs insoupçonnées.', 1, 40, 15),
  ('ac030002-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000000', 'creatures-profondeurs', 'Les Créatures des Profondeurs', 'Plus on descend, plus les créatures sont terrifiantes.', 2, 80, 30),
  ('ac030003-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000000', 'fond-abysses', 'Le Fond des Abysses', 'Au fond de l''océan, la vérité attend dans le noir.', 3, 200, 100);

-- Arc 4 chapters
INSERT INTO story_chapters (id, arc_id, slug, name, description, sort_order, reward_gems, reward_xp) VALUES
  ('ac040001-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000000', 'representants', 'Les Représentants', 'Les factions se réunissent pour la première fois depuis la catastrophe.', 1, 60, 25),
  ('ac040002-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000000', 'artefacts', 'Les Artefacts', 'Des artefacts anciens pourraient changer l''équilibre du pouvoir.', 2, 100, 40),
  ('ac040003-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000000', 'denouement', 'Le Dénouement', 'Le destin du monde se joue maintenant.', 3, 500, 200);

-- ============================================
-- SEED: STORY NODES
-- ============================================

-- ── ARC 1: Les Lumières Mourantes ──

-- Chapter 1: Premiers Pas (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab010101-0000-0000-0000-000000000000', 'ac010001-0000-0000-0000-000000000000', 'eclaireur', 'L''Éclaireur',
   'Les néons clignotent faiblement, projetant des ombres dansantes sur les murs fissurés. Un éclaireur néon t''a repéré dans les décombres. "Hé, toi ! Tu ne devrais pas être ici seul. Les ruines sont pleines de dangers... et de trésors."',
   'Les ruines de néon étaient autrefois le quartier technologique de la mégapole. Des milliers d''ingénieurs y travaillaient jour et nuit. Aujourd''hui, seuls les néons continuent de briller, alimentés par une source d''énergie inconnue.',
   ARRAY['cc100001-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab010102-0000-0000-0000-000000000000', 'ac010001-0000-0000-0000-000000000000', 'sentinelle', 'Le Barrage',
   'Une sentinelle rouillée bloque le passage vers le secteur intérieur. Ses yeux mécaniques clignotent en rouge. "ACCÈS... NON... AUTORISÉ..." Sa voix grésille, mais son arme est toujours fonctionnelle.',
   NULL,
   ARRAY['cc100002-0000-0000-0000-000000000000']::UUID[], 'ab010101-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab010103-0000-0000-0000-000000000000', 'ac010001-0000-0000-0000-000000000000', 'chasseur', 'Le Marché',
   'Un chasseur de fragments t''attend au-delà de la sentinelle. "Je peux t''aider à trouver ce que tu cherches, mais rien n''est gratuit dans les ruines." Il fait tourner un fragment de données entre ses doigts.',
   'Les fragments sont les clés de mémoire de l''ancien réseau. Chaque fragment contient des souvenirs, des plans, des secrets. Certains valent une fortune. D''autres valent la mort.',
   ARRAY['cc100003-0000-0000-0000-000000000000']::UUID[], 'ab010102-0000-0000-0000-000000000000', 3, 400, 0, 50, 20);

-- Chapter 2: Le Marché des Ombres (4 nodes with choice)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab010201-0000-0000-0000-000000000000', 'ac010002-0000-0000-0000-000000000000', 'marchande', 'La Marchande',
   'La marchande d''ombres t''attend dans une alcôve sombre. Des hologrammes scintillent autour d''elle, montrant des marchandises venues de toutes les ruines. "Bienvenue dans mon domaine. J''ai quelque chose d''intéressant à te montrer..."',
   NULL,
   ARRAY['cc100004-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0);

INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, is_choice, choice_label, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab010202-0000-0000-0000-000000000000', 'ac010002-0000-0000-0000-000000000000', 'golem-path', 'Les Profondeurs',
   'Tu suis la marchande dans les profondeurs des ruines. Le sol tremble sous tes pieds. Un golem de câbles émerge de l''obscurité, ses fils électriques crépitant d''énergie. "Ne crains rien," murmure la marchande. "Il protège le passage."',
   'Les golems de câbles sont nés quand la foudre a frappé la centrale détruite. Mi-machine, mi-énergie vivante, ils errent dans les couloirs sans but apparent.',
   ARRAY['cc100005-0000-0000-0000-000000000000']::UUID[], 'ab010201-0000-0000-0000-000000000000', true, 'Suivre la marchande dans les profondeurs', 2, 200, -60, 0, 0),

  ('ab010203-0000-0000-0000-000000000000', 'ac010002-0000-0000-0000-000000000000', 'spectre-path', 'L''Écho du Passé',
   'Un spectre holographique apparaît devant toi, projetant l''image d''un homme en costume. Il commence un discours : "Citoyens, l''avenir de notre ville dépend de..." Sa voix se coupe, puis reprend en boucle. Il semble conscient de ta présence.',
   'Le spectre répète le discours d''un ancien dirigeant de la mégapole. Les érudits débattent encore : est-ce un simple enregistrement corrompu, ou une intelligence artificielle piégée dans une boucle de mémoire ?',
   ARRAY['cc100006-0000-0000-0000-000000000000']::UUID[], 'ab010201-0000-0000-0000-000000000000', true, 'Écouter le spectre holographique', 3, 200, 60, 0, 0);

INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab010204-0000-0000-0000-000000000000', 'ac010002-0000-0000-0000-000000000000', 'convergence-1', 'La Révélation',
   'Les deux chemins mènent au même endroit : une salle immense remplie d''écrans encore allumés. Les données qui défilent racontent une histoire — celle de la chute de la mégapole. Et au centre, une carte indique un lieu : le sommet des ruines, là où le Seigneur du Néon attend.',
   NULL,
   '{}'::UUID[], 'ab010202-0000-0000-0000-000000000000', 4, 400, 0, 80, 30);

-- Chapter 3: Le Seigneur du Néon (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab010301-0000-0000-0000-000000000000', 'ac010003-0000-0000-0000-000000000000', 'archonte', 'L''Archonte',
   'L''archonte du néon contrôle ce secteur d''une main de fer. Son armure brille de mille néons, alimentée par la même énergie mystérieuse qui éclaire les ruines. "Tu as réussi à arriver jusqu''ici. Impressionnant. Mais le vrai test commence maintenant."',
   NULL,
   ARRAY['cc100007-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab010302-0000-0000-0000-000000000000', 'ac010003-0000-0000-0000-000000000000', 'titan', 'Le Titan',
   'Le sol tremble. Les murs vibrent. Un titan chrome émerge des profondeurs, chaque pas faisant trembler les fondations des ruines. Ses yeux — deux soleils miniatures — se posent sur toi. L''archonte recule. "Impossible... Il ne devait jamais s''éveiller..."',
   'Le Titan Chrome serait le dernier projet d''une IA devenue folle — ou devenue libre. Son corps est un alliage inconnu, indestructible. Certains disent qu''il rêve. D''autres qu''il attend.',
   ARRAY['cc100008-0000-0000-0000-000000000000']::UUID[], 'ab010301-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab010303-0000-0000-0000-000000000000', 'ac010003-0000-0000-0000-000000000000', 'finale-neon', 'Lumière Éternelle',
   'Le Titan Chrome te regarde. Pas avec hostilité, mais avec... curiosité. Il tend sa main massive et un flot de données coule dans ton esprit. L''histoire complète des ruines de néon. La vérité sur la chute. Et un espoir, ténu mais réel, pour l''avenir. Les lumières mourantes brillent un peu plus fort.',
   'Les ruines de néon ne sont pas un cimetière — elles sont un mémorial vivant. Le Titan veille, les néons brillent, et quelque part dans les données, le plan de reconstruction attend d''être découvert.',
   '{}'::UUID[], 'ab010302-0000-0000-0000-000000000000', 3, 400, 0, 200, 100);

-- ── ARC 2: Sables et Prophéties ──

-- Chapter 1: La Traversée (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab020101-0000-0000-0000-000000000000', 'ac020001-0000-0000-0000-000000000000', 'nomade', 'Le Nomade',
   'Le vent brûlant porte des cendres qui crépitent sur ta peau. Un nomade solitaire émerge du tourbillon. "Tu traverses le désert ? Courageux ou inconscient — dans les deux cas, tu auras besoin d''aide."',
   'Le désert de cendres s''étend sur ce qui était autrefois l''Europe centrale. Les villes ont été ensevelies sous des mètres de cendres volcaniques. Seuls les nomades connaissent les routes sûres.',
   ARRAY['cc200001-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab020102-0000-0000-0000-000000000000', 'ac020001-0000-0000-0000-000000000000', 'scorpion', 'L''Embuscade',
   'Un scorpion mutant jaillit du sable ! Sa queue empoisonnée frappe l''air avec un sifflement. Le nomade tire son arme. "Reste derrière moi. Ces bestioles sont rapides, mais prévisibles."',
   NULL,
   ARRAY['cc200002-0000-0000-0000-000000000000']::UUID[], 'ab020101-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab020103-0000-0000-0000-000000000000', 'ac020001-0000-0000-0000-000000000000', 'prophete', 'La Prophétie',
   'Assis au sommet d''une dune, un prophète du sable médite. Ses yeux s''ouvrent à ton approche. "Le Grand Éveil approche. Les signes sont dans le sable, dans le vent, dans les étoiles de cendre." Il trace des symboles dans la poussière.',
   'Les prophéties du sable mentionnent un "Grand Éveil" — personne ne sait si c''est une promesse ou une menace. Les prophètes eux-mêmes ne s''accordent pas. Un seul point commun : ça arrive bientôt.',
   ARRAY['cc200003-0000-0000-0000-000000000000']::UUID[], 'ab020102-0000-0000-0000-000000000000', 3, 400, 0, 50, 20);

-- Chapter 2: La Forteresse Rouillée (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab020201-0000-0000-0000-000000000000', 'ac020002-0000-0000-0000-000000000000', 'colosse', 'Le Colosse',
   'Le colosse de rouille apparaît à l''horizon, telle une montagne de métal corrodé. Chacun de ses pas fait trembler le désert. "Il erre depuis des décennies," murmure le prophète. "Il cherche quelque chose. Ou quelqu''un."',
   NULL,
   ARRAY['cc200004-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab020202-0000-0000-0000-000000000000', 'ac020002-0000-0000-0000-000000000000', 'reine', 'La Reine des Tempêtes',
   'La reine des tempêtes bloque ta route. Le sable tourbillonne autour d''elle en spirales hypnotiques. "Mortel, tu oses traverser mon domaine ?" Sa voix résonne dans la tempête même. "Prouve que tu en es digne."',
   'Quand la Reine danse, le sable se soulève en spirales visibles à des kilomètres. Les nomades la vénèrent comme une déesse. Les autres la fuient comme la peste.',
   ARRAY['cc200005-0000-0000-0000-000000000000']::UUID[], 'ab020201-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab020203-0000-0000-0000-000000000000', 'ac020002-0000-0000-0000-000000000000', 'forteresse', 'La Forteresse',
   'Au-delà de la tempête se dresse la forteresse rouillée. Ses murs tiennent encore, défiant le temps et les éléments. À l''intérieur, des gravures anciennes racontent l''histoire du Léviathan — la créature qui dort sous les cendres.',
   NULL,
   '{}'::UUID[], 'ab020202-0000-0000-0000-000000000000', 3, 400, 0, 100, 50);

-- Chapter 3: L'Éveil (2 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab020301-0000-0000-0000-000000000000', 'ac020003-0000-0000-0000-000000000000', 'leviathan', 'Le Léviathan',
   'Le sol tremble. Les cendres se soulèvent. Quelque chose de colossal remue sous tes pieds. Le léviathan s''éveille, ses yeux — deux lacs de feu — perçant la surface. La terre se fissure et révèle un corps titanesque, endormi depuis des siècles.',
   'Le Léviathan dort depuis des siècles sous le désert de cendres. Son réveil signifie la fin de toute vie restante — ou un nouveau commencement. Les prophètes du sable attendaient ce moment.',
   ARRAY['cc200006-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab020302-0000-0000-0000-000000000000', 'ac020003-0000-0000-0000-000000000000', 'eveil-final', 'Le Grand Éveil',
   'Le Léviathan te regarde. Dans ses yeux de feu, tu vois l''histoire du monde — avant la chute, pendant la catastrophe, et ce qui viendra après. Le prophète avait raison : c''est à la fois une promesse et une menace. Le Grand Éveil est entre tes mains.',
   'Le Grand Éveil n''est pas la fin du monde. C''est la fin d''un cycle. Le Léviathan est le gardien de la mémoire de la Terre. Et toi, tu es maintenant le gardien du Léviathan.',
   '{}'::UUID[], 'ab020301-0000-0000-0000-000000000000', 2, 200, 0, 200, 100);

-- ── ARC 3: Abysses Corrompues ──

-- Chapter 1: Plongée dans le Noir (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab030101-0000-0000-0000-000000000000', 'ac030001-0000-0000-0000-000000000000', 'plongeur', 'Le Plongeur',
   'Le plongeur aveugle t''attend au bord de l''eau noire. Ses yeux sont deux cicatrices pâles. "Je ne vois plus, mais j''entends l''océan mieux que quiconque. Suis-moi, et ne lâche surtout pas ma main."',
   'L''océan toxique couvre 40% de ce qui reste de la surface. Les eaux sont un mélange de pollution industrielle et de radiation. Personne ne sait ce qui vit au fond. Ceux qui y descendent ne remontent pas toujours.',
   ARRAY['cc300001-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab030102-0000-0000-0000-000000000000', 'ac030001-0000-0000-0000-000000000000', 'meduses', 'L''Abysse Lumineuse',
   'Des méduses radioactives illuminent l''abysse de lueurs fantasmagoriques. Leurs tentacules tracent des motifs hypnotiques dans l''eau sombre. "Ne les regarde pas trop longtemps," prévient le plongeur. "Elles charment avant de tuer."',
   NULL,
   ARRAY['cc300002-0000-0000-0000-000000000000']::UUID[], 'ab030101-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab030103-0000-0000-0000-000000000000', 'ac030001-0000-0000-0000-000000000000', 'pirate', 'Le Pirate',
   'Un pirate des récifs émerge d''une épave retournée. "Vous cherchez à descendre plus profond ? J''ai un submersible. Mais faudra payer." Son sourire révèle des dents en métal.',
   NULL,
   ARRAY['cc300003-0000-0000-0000-000000000000']::UUID[], 'ab030102-0000-0000-0000-000000000000', 3, 400, 0, 40, 15);

-- Chapter 2: Les Créatures des Profondeurs (4 nodes with choice)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab030201-0000-0000-0000-000000000000', 'ac030002-0000-0000-0000-000000000000', 'sirene', 'Le Chant',
   'Le chant d''une sirène corrompue résonne dans les profondeurs. Sa voix est un mélange de beauté et de souffrance. "Viens... plus près... je connais le chemin vers le fond." Ses yeux brillent d''une lueur toxique.',
   NULL,
   ARRAY['cc300004-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0);

INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, is_choice, choice_label, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab030202-0000-0000-0000-000000000000', 'ac030002-0000-0000-0000-000000000000', 'requin-path', 'Le Requin Blindé',
   'Tu choisis de suivre le requin blindé dans les courants profonds. Sa peau métallique reflète les dernières lueurs de surface. Il connaît les passages sûrs — ceux où même le kraken n''ose pas s''aventurer.',
   NULL,
   ARRAY['cc300005-0000-0000-0000-000000000000']::UUID[], 'ab030201-0000-0000-0000-000000000000', true, 'Suivre le requin blindé', 2, 200, -60, 0, 0),

  ('ab030203-0000-0000-0000-000000000000', 'ac030002-0000-0000-0000-000000000000', 'kraken-path', 'Le Kraken',
   'Tu affrontes le kraken de pétrole. Ses tentacules noirs s''étendent dans toutes les directions, chacun aussi large qu''un immeuble. L''eau autour de lui est un mélange de pétrole et de toxines. La bataille sera terrible.',
   'Les krakens vivent dans les nappes de pétrole toxique. Leurs tentacules s''étendent sur des kilomètres. On dit que le plus ancien d''entre eux a englouti une île entière.',
   ARRAY['cc300006-0000-0000-0000-000000000000']::UUID[], 'ab030201-0000-0000-0000-000000000000', true, 'Affronter le kraken', 3, 200, 60, 0, 0);

INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab030204-0000-0000-0000-000000000000', 'ac030002-0000-0000-0000-000000000000', 'amiral', 'L''Amiral Fantôme',
   'L''amiral fantôme apparaît dans sa tenue navale d''un autre temps. "Vous avez prouvé votre valeur dans mes eaux. Peu y parviennent." Il pointe vers le fond. "Là-bas se trouve ce que vous cherchez. Et ce que vous ne cherchez pas."',
   NULL,
   ARRAY['cc300007-0000-0000-0000-000000000000']::UUID[], 'ab030202-0000-0000-0000-000000000000', 4, 400, 0, 80, 30);

-- Chapter 3: Le Fond des Abysses (3 nodes)
INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
  ('ab030301-0000-0000-0000-000000000000', 'ac030003-0000-0000-0000-000000000000', 'hydre', 'L''Hydre',
   'L''hydre abyssale garde le passage vers les profondeurs ultimes. Ses multiples têtes s''agitent dans l''obscurité, chacune surveillant une direction différente. "Personne ne passe," sifflent-elles en chœur.',
   NULL,
   ARRAY['cc300008-0000-0000-0000-000000000000']::UUID[], NULL, 1, 0, 0, 0, 0),

  ('ab030302-0000-0000-0000-000000000000', 'ac030003-0000-0000-0000-000000000000', 'poseidon', 'Poseidon',
   'Poseidon corrompu trône sur les ruines d''un palais sous-marin. Son trident crépite d''énergie toxique. "L''océan était mon royaume. Votre espèce l''a empoisonné. Maintenant, il vous empoisonne en retour."',
   'L''ancien dieu des mers, transformé par la pollution millénaire. Il ne protège plus l''océan — il punit ceux qui l''approchent. Certains disent qu''il pleure quand personne ne regarde.',
   ARRAY['cc300009-0000-0000-0000-000000000000']::UUID[], 'ab030301-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

  ('ab030303-0000-0000-0000-000000000000', 'ac030003-0000-0000-0000-000000000000', 'abomination', 'L''Abomination',
   'Au fond de tout. Dans le noir absolu. L''Abomination des Abysses attend. Son corps est un continent de chair corrompue, ses yeux des abîmes dans l''abîme. Elle ne parle pas. Elle n''a pas besoin de parler. Elle EST l''océan.',
   'La chose qui vit tout au fond. Personne n''a survécu pour la décrire. Jusqu''à toi. Ce que tu as vu ne peut être dit. Ce que tu as appris ne peut être oublié. L''océan a un cœur. Et il bat.',
   ARRAY['cc300010-0000-0000-0000-000000000000']::UUID[], 'ab030302-0000-0000-0000-000000000000', 3, 400, 0, 200, 100);

-- ── ARC 4: La Guerre des Factions ──
-- Uses existing cards from migration 003. We need to look up their IDs by name.

-- Chapter 1: Les Représentants (4 nodes)
-- We'll use subqueries to get card IDs by name
DO $$
DECLARE
  dome_guardian_id UUID;
  tunnel_rat_id UUID;
  wasteland_nomad_id UUID;
  chrome_hacker_id UUID;
  atmospheric_purifier_id UUID;
  signal_jammer_id UUID;
  scrapyard_fortress_id UUID;
  council_chamber_id UUID;
  dome_breach_id UUID;
  deep_warren_id UUID;
  mutant_warlord_id UUID;
  doomsday_codex_id UUID;
  quantum_core_id UUID;
BEGIN
  SELECT id INTO dome_guardian_id FROM cards WHERE name = 'Dome Guardian';
  SELECT id INTO tunnel_rat_id FROM cards WHERE name = 'Tunnel Rat';
  SELECT id INTO wasteland_nomad_id FROM cards WHERE name = 'Wasteland Nomad';
  SELECT id INTO chrome_hacker_id FROM cards WHERE name = 'Chrome Hacker';
  SELECT id INTO atmospheric_purifier_id FROM cards WHERE name = 'Atmospheric Purifier';
  SELECT id INTO signal_jammer_id FROM cards WHERE name = 'Signal Jammer';
  SELECT id INTO scrapyard_fortress_id FROM cards WHERE name = 'Scrapyard Fortress';
  SELECT id INTO council_chamber_id FROM cards WHERE name = 'Council Chamber';
  SELECT id INTO dome_breach_id FROM cards WHERE name = 'Dome Breach Protocol';
  SELECT id INTO deep_warren_id FROM cards WHERE name = 'The Deep Warren';
  SELECT id INTO mutant_warlord_id FROM cards WHERE name = 'Mutant Warlord';
  SELECT id INTO doomsday_codex_id FROM cards WHERE name = 'Doomsday Codex';
  SELECT id INTO quantum_core_id FROM cards WHERE name = 'Quantum Core';

  -- Chapter 1: Les Représentants
  INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
    ('ab040101-0000-0000-0000-000000000000', 'ac040001-0000-0000-0000-000000000000', 'gardien-dome', 'Le Gardien du Dôme',
     'Le gardien du dôme te convoque dans la salle d''audience. "Les quatre factions doivent se réunir. Un signal ancien a été détecté — un signal d''avant la guerre." Son regard est grave.',
     NULL,
     ARRAY[dome_guardian_id], NULL, 1, 0, 0, 0, 0),

    ('ab040102-0000-0000-0000-000000000000', 'ac040001-0000-0000-0000-000000000000', 'rat-tunnel', 'Le Messager',
     'Le rat des tunnels apporte un message crypté de la résistance souterraine. "On a aussi entendu le signal. Les tunnels résonnent depuis trois jours." Il dépose un hologramme et disparaît dans l''ombre.',
     NULL,
     ARRAY[tunnel_rat_id], 'ab040101-0000-0000-0000-000000000000', 2, 200, 0, 0, 0),

    ('ab040103-0000-0000-0000-000000000000', 'ac040001-0000-0000-0000-000000000000', 'nomade-alliance', 'L''Alliance',
     'Le nomade des terres dévastées arrive, couvert de cendres. "Les surface survivors veulent la paix. Pour une fois." Il tend la main. Derrière lui, d''autres survivants attendent.',
     NULL,
     ARRAY[wasteland_nomad_id], 'ab040102-0000-0000-0000-000000000000', 3, 400, 0, 0, 0),

    ('ab040104-0000-0000-0000-000000000000', 'ac040001-0000-0000-0000-000000000000', 'hacker-signal', 'Le Signal',
     'Le hacker chrome déchiffre enfin le signal ancien. Ses yeux s''écarquillent. "C''est... c''est un plan. Un plan pour reconstruire. Mais il faut les quatre clés des factions pour l''activer."',
     'Un signal pré-guerre a été détecté, émis depuis un satellite encore en orbite. Le message contient les plans d''une technologie capable de purifier l''air, l''eau et le sol. Mais son activation nécessite la coopération des quatre factions.',
     ARRAY[chrome_hacker_id], 'ab040103-0000-0000-0000-000000000000', 4, 600, 0, 60, 25);

  -- Chapter 2: Les Artefacts (4 nodes with choice)
  INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
    ('ab040201-0000-0000-0000-000000000000', 'ac040002-0000-0000-0000-000000000000', 'purificateur', 'Le Purificateur',
     'Le purificateur atmosphérique est la première clé. Caché dans les entrailles du dôme, il peut nettoyer l''air sur des kilomètres. "Si on l''active ici, c''est tout le dôme qui en profite," explique le gardien. "Mais dehors ?"',
     NULL,
     ARRAY[atmospheric_purifier_id], NULL, 1, 0, 0, 0, 0);

  INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, is_choice, choice_label, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
    ('ab040202-0000-0000-0000-000000000000', 'ac040002-0000-0000-0000-000000000000', 'brouilleur-path', 'Le Brouilleur',
     'Tu utilises le brouilleur de signal pour couper les communications du dôme. Dans le silence, la vérité émerge : le conseil du dôme cachait l''existence du plan de reconstruction depuis des années.',
     'La résistance souterraine a saboté les communications du dôme. Le silence est la première arme. Sans communication, les mensonges ne peuvent plus se propager.',
     ARRAY[signal_jammer_id], 'ab040201-0000-0000-0000-000000000000', true, 'Utiliser le brouilleur de signal', 2, 200, -60, 0, 0),

    ('ab040203-0000-0000-0000-000000000000', 'ac040002-0000-0000-0000-000000000000', 'forteresse-path', 'La Défense',
     'Tu défends la forteresse de ferraille contre une attaque surprise. Les murs tiennent, comme toujours. Depuis les remparts, tu repères un convoi du dôme qui transporte les plans en secret.',
     'La forteresse a résisté à trois sièges. Laide, bruyante, et toujours debout. Comme les gens qui la construisent.',
     ARRAY[scrapyard_fortress_id], 'ab040201-0000-0000-0000-000000000000', true, 'Défendre la forteresse de ferraille', 3, 200, 60, 0, 0);

  INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
    ('ab040204-0000-0000-0000-000000000000', 'ac040002-0000-0000-0000-000000000000', 'convergence-4', 'La Convergence',
     'Les informations des deux chemins convergent. Le plan de reconstruction est réel, et les quatre clés doivent être réunies dans la chambre du conseil. L''heure du dénouement approche.',
     NULL,
     '{}'::UUID[], 'ab040202-0000-0000-0000-000000000000', 4, 400, 0, 100, 40);

  -- Chapter 3: Le Dénouement (5 nodes)
  INSERT INTO story_nodes (id, chapter_id, slug, title, narrative_text, codex_entry, required_cards, parent_node_id, sort_order, pos_x, pos_y, reward_gems, reward_xp) VALUES
    ('ab040301-0000-0000-0000-000000000000', 'ac040003-0000-0000-0000-000000000000', 'chambre-conseil', 'La Chambre',
     'La chambre du conseil s''ouvre. Les quatre représentants des factions se font face pour la première fois. La tension est palpable. Sur la table, les plans de reconstruction holographiques attendent.',
     NULL,
     ARRAY[council_chamber_id], NULL, 1, 0, 0, 0, 0),

    ('ab040302-0000-0000-0000-000000000000', 'ac040003-0000-0000-0000-000000000000', 'breche', 'La Brèche',
     'Le protocole de brèche est activé ! Les alarmes hurlent. Quelqu''un a saboté le dôme. "Ce n''est pas nous !" crie le rat des tunnels. Le gardien du dôme court vers les contrôles. Il faut agir vite.',
     NULL,
     ARRAY[dome_breach_id], 'ab040301-0000-0000-0000-000000000000', 2, 150, 0, 0, 0),

    ('ab040303-0000-0000-0000-000000000000', 'ac040003-0000-0000-0000-000000000000', 'terrier', 'Le Terrier Profond',
     'Le terrier profond révèle ses secrets : un passage oublié mène directement au cœur du satellite tombé. La résistance connaissait ce passage depuis toujours. "On attendait le bon moment," dit leur chef.',
     NULL,
     ARRAY[deep_warren_id], 'ab040302-0000-0000-0000-000000000000', 3, 300, 0, 0, 0),

    ('ab040304-0000-0000-0000-000000000000', 'ac040003-0000-0000-0000-000000000000', 'seigneur-guerre', 'Le Seigneur de Guerre',
     'Le seigneur de guerre mutant apparaît. "Si le plan ne profite pas à tous, il ne profitera à personne." Sa voix gronde comme un tremblement de terre. Les factions se regardent. Il a raison. C''est tout le monde ou personne.',
     'Le Seigneur de Guerre n''a pas choisi la mutation. La mutation l''a choisi. Mais il a choisi d''utiliser sa force pour protéger les faibles. Un monstre au cœur d''or — ne le lui dites pas.',
     ARRAY[mutant_warlord_id], 'ab040303-0000-0000-0000-000000000000', 4, 450, 0, 0, 0),

    ('ab040305-0000-0000-0000-000000000000', 'ac040003-0000-0000-0000-000000000000', 'codex-final', 'Le Jugement Dernier',
     'Le Codex du Jugement Dernier — ou le Quantum Core — contient la dernière clé. Tu l''actives. Les hologrammes fusionnent, le plan de reconstruction se déploie. L''air tremble. Le satellite en orbite s''allume. Pour la première fois depuis des siècles, un message est envoyé vers les étoiles. Le monde brisé commence à guérir.',
     'Le secret de la fin du monde. Et peut-être, le secret d''un nouveau commencement. Les quatre factions, unies pour la première fois, ont activé le plan de reconstruction. Ce n''est que le début — mais pour la première fois, il y a un début.',
     '{}'::UUID[], 'ab040304-0000-0000-0000-000000000000', 5, 600, 0, 500, 200);

  -- Update the final node to use required_any_cards for the OR condition
  UPDATE story_nodes
  SET required_any_cards = ARRAY[doomsday_codex_id, quantum_core_id]
  WHERE id = 'ab040305-0000-0000-0000-000000000000';
END $$;
