-- 011: Faction Encyclopedia
-- Table for extended faction lore, leaders, and metadata

CREATE TABLE factions (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  lore TEXT NOT NULL,
  motto TEXT,
  leader_name TEXT,
  leader_title TEXT,
  color TEXT NOT NULL,
  icon TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: public read
ALTER TABLE factions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "factions_public_read" ON factions FOR SELECT USING (true);

-- Seed 4 factions
INSERT INTO factions (slug, name, description, lore, motto, leader_name, leader_title, color, icon, sort_order) VALUES
(
  'dome_dwellers',
  'Dome Dwellers',
  'Les habitants des dômes protecteurs, derniers bastions de la civilisation d''avant. Ils contrôlent les ressources et la technologie avancée depuis leurs cités hermétiques.',
  'Lorsque le Grand Effondrement a ravagé la surface, seuls les plus riches et les plus connectés ont pu s''abriter sous les dômes géodésiques. Depuis trois générations, les Dome Dwellers vivent dans un confort artificiel, leurs cités alimentées par des réacteurs à fusion. Mais leur isolement a un prix : une société rigide, hiérarchisée, où chaque ressource est comptée et chaque citoyen surveillé. Les élites du Conseil des Dômes maintiennent leur pouvoir par le contrôle de l''information et la promesse d''un retour à la surface — une promesse qu''ils n''ont aucune intention de tenir.',
  'Sous le dôme, nous sommes éternels.',
  'Archonte Veris',
  'Chancelier Suprême du Conseil des Dômes',
  '#3B82F6',
  '',
  0
),
(
  'underground_resistance',
  'Underground Resistance',
  'Les rebelles des tunnels et des anciennes mines. Ils luttent contre l''oppression des Dômes et cherchent à libérer l''humanité de ses chaînes technologiques.',
  'Née dans les entrailles de la terre, la Résistance Souterraine est composée de ceux qui ont été rejetés par les Dômes ou qui ont choisi de fuir leur contrôle. Dans un réseau labyrinthique de tunnels, cavernes et anciennes stations de métro, ils ont bâti une société parallèle fondée sur la liberté et l''entraide. Leurs hackers sont capables de percer les défenses numériques des Dômes, et leurs éclaireurs connaissent chaque recoin du monde souterrain. La Résistance croit que la vraie humanité ne peut survivre que libre — même si cette liberté se paie en sang et en sacrifices.',
  'Libres sous terre, libres partout.',
  'Commandante Nyra',
  'Voix de la Résistance',
  '#DC2626',
  '',
  1
),
(
  'surface_survivors',
  'Surface Survivors',
  'Les survivants endurcis de la surface ravagée. Nomades et adaptables, ils ont appris à vivre dans un monde hostile que tous les autres ont abandonné.',
  'Quand les Dômes se sont scellés et que la Résistance s''est enfouie, certains sont restés. Les Surface Survivors sont les descendants de ceux qui ont refusé de fuir — par choix, par fierté, ou simplement parce qu''ils n''avaient nulle part où aller. Des générations de survie dans les tempêtes de cendres, les radiations résiduelles et les créatures mutantes les ont transformés. Plus résistants, plus ingénieux, plus connectés à la terre brisée que quiconque. Leurs clans nomades suivent les routes des caravanes, échangeant des ressources et des histoires entre les oasis de vie qui persistent malgré tout.',
  'La surface nous forge, la surface nous nourrit.',
  'Ancien Korvak',
  'Patriarche des Clans Nomades',
  '#16A34A',
  '',
  2
),
(
  'tech_scavengers',
  'Tech Scavengers',
  'Les pilleurs de technologie qui fouillent les ruines de l''ancien monde. Génies du bricolage et de la récupération, ils transforment les débris en armes redoutables.',
  'Dans les ruines des mégapoles effondrées, les Tech Scavengers ont trouvé leur paradis. Chaque bâtiment écroulé est un trésor, chaque serveur abandonné une mine d''or de données. Mi-archéologues, mi-ingénieurs, ils ont développé un talent unique pour restaurer, modifier et combiner les technologies d''avant le Grand Effondrement. Leurs créations hybrides — mi-anciennes, mi-improvisées — sont à la fois brillantes et dangereuses. Organisés en guildes rivales, les Scavengers se disputent les meilleurs sites de fouille et les artefacts les plus précieux, alimentant un marché noir technologique qui fait tourner l''économie du monde post-apocalyptique.',
  'Tout peut être réparé, tout peut être amélioré.',
  'Maîtresse Zephyr',
  'Doyenne de la Guilde des Récupérateurs',
  '#D97706',
  '',
  3
);
