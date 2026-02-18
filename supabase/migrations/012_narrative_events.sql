-- 012: Narrative Events
-- Tables for community narrative events with faction-aligned choices

CREATE TABLE narrative_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  narrative_text TEXT NOT NULL,
  image_url TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  reward_gems INT DEFAULT 50,
  reward_xp INT DEFAULT 25,
  is_active BOOLEAN DEFAULT true,
  winning_choice_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE event_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES narrative_events(id) ON DELETE CASCADE,
  faction TEXT,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE event_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  event_id UUID NOT NULL REFERENCES narrative_events(id),
  choice_id UUID NOT NULL REFERENCES event_choices(id),
  reward_claimed BOOLEAN DEFAULT false,
  participated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- RLS
ALTER TABLE narrative_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_read" ON narrative_events FOR SELECT USING (true);

ALTER TABLE event_choices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "choices_public_read" ON event_choices FOR SELECT USING (true);

ALTER TABLE event_participations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "participations_own_read" ON event_participations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "participations_own_insert" ON event_participations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "participations_own_update" ON event_participations FOR UPDATE USING (auth.uid() = user_id);

-- Seed 3 events

-- Event 1: Active (current)
INSERT INTO narrative_events (id, slug, title, description, narrative_text, starts_at, ends_at, reward_gems, reward_xp, is_active)
VALUES (
  'e1000000-0000-0000-0000-000000000001',
  'battle-for-neon-ruins',
  'La Bataille des Ruines de Néon',
  'Les factions se disputent le contrôle d''un ancien data center découvert dans les Ruines de Néon.',
  'Un séisme a révélé l''entrée d''un data center pré-Effondrement, intact et encore alimenté par un réacteur autonome. Les données qu''il contient pourraient changer l''équilibre des pouvoirs. Chaque faction a ses raisons de le revendiquer — et ses méthodes pour s''en emparer. Le Conseil des Dômes veut le verrouiller, la Résistance veut libérer ses secrets, les Survivors veulent le neutraliser, et les Scavengers veulent le démonter pièce par pièce.',
  '2026-02-01T00:00:00Z',
  '2026-03-01T00:00:00Z',
  75,
  40,
  true
);

INSERT INTO event_choices (id, event_id, faction, label, description, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'dome_dwellers', 'Verrouiller le data center', 'Sécuriser le site et réserver l''accès aux données au Conseil des Dômes.', 0),
('c1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 'underground_resistance', 'Libérer les données', 'Hacker les systèmes et diffuser les données à tous, gratuitement.', 1),
('c1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', 'tech_scavengers', 'Récupérer le matériel', 'Démonter les serveurs et les composants pour alimenter la Guilde.', 2);

-- Event 2: Past (ended with winner)
INSERT INTO narrative_events (id, slug, title, description, narrative_text, starts_at, ends_at, reward_gems, reward_xp, is_active, winning_choice_id)
VALUES (
  'e1000000-0000-0000-0000-000000000002',
  'caravan-ambush',
  'L''Embuscade de la Caravane',
  'Une caravane de ravitaillement a été attaquée dans le Désert de Cendres. Qui est responsable ?',
  'La plus grande caravane de la saison, transportant des médicaments et des pièces de rechange, a été interceptée en plein désert. Les survivants racontent des versions contradictoires. Les Dome Dwellers accusent la Résistance, qui accuse les Scavengers, qui pointent du doigt un clan de Survivors renégats. La vérité pourrait bien être plus complexe que prévu.',
  '2026-01-01T00:00:00Z',
  '2026-01-31T00:00:00Z',
  50,
  25,
  false,
  'c2000000-0000-0000-0000-000000000002'
);

INSERT INTO event_choices (id, event_id, faction, label, description, sort_order) VALUES
('c2000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000002', 'dome_dwellers', 'Enquête officielle', 'Envoyer des enquêteurs du Conseil pour établir la vérité.', 0),
('c2000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000002', 'underground_resistance', 'Contre-attaque', 'Lancer une opération de représailles contre les vrais coupables.', 1),
('c2000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000002', 'surface_survivors', 'Médiation tribale', 'Réunir les chefs de clan pour résoudre le conflit par le dialogue.', 2);

-- Event 3: Upcoming (future)
INSERT INTO narrative_events (id, slug, title, description, narrative_text, starts_at, ends_at, reward_gems, reward_xp, is_active)
VALUES (
  'e1000000-0000-0000-0000-000000000003',
  'toxic-ocean-expedition',
  'L''Expédition de l''Océan Toxique',
  'Une mystérieuse signal radio émane des profondeurs de l''Océan Toxique. Qui osera plonger ?',
  'Depuis trois jours, un signal codé émet depuis les abysses de l''Océan Toxique. Les analystes de chaque faction ont déchiffré un fragment du message : il parle d''une "Arche" — un vaisseau ou une structure capable de purifier les eaux contaminées. Si c''est vrai, c''est la découverte du siècle. Mais les profondeurs toxiques n''ont jamais été cartographiées, et ceux qui y descendent n''en reviennent pas toujours.',
  '2026-03-15T00:00:00Z',
  '2026-04-15T00:00:00Z',
  100,
  50,
  true
);

INSERT INTO event_choices (id, event_id, faction, label, description, sort_order) VALUES
('c3000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000003', 'underground_resistance', 'Plongée secrète', 'Envoyer une équipe d''infiltration en sous-marin de fortune.', 0),
('c3000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000003', 'tech_scavengers', 'Drone d''exploration', 'Construire un drone submersible pour explorer sans risquer de vies.', 1),
('c3000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000003', 'surface_survivors', 'Expédition tribale', 'Envoyer les meilleurs plongeurs des clans côtiers.', 2);
