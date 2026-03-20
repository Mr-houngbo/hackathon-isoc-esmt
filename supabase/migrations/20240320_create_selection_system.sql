-- Migration pour le système de sélection, notation et regroupement
-- À exécuter dans la console Supabase SQL

-- Table des membres du comité de sélection
CREATE TABLE IF NOT EXISTS comite (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom_prenom TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

-- Table des assignments (quel membre du comité note quel dossier)
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comite_id UUID REFERENCES comite(id) ON DELETE CASCADE,
  equipe_id UUID REFERENCES equipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(comite_id, equipe_id)
);

-- Table des notes
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comite_id UUID REFERENCES comite(id) ON DELETE CASCADE,
  equipe_id UUID REFERENCES equipes(id) ON DELETE CASCADE,
  -- Critères communs /100
  qualite_projet INTEGER CHECK (qualite_projet BETWEEN 0 AND 25),
  motivation INTEGER CHECK (motivation BETWEEN 0 AND 20),
  clarte_problematique INTEGER CHECK (clarte_problematique BETWEEN 0 AND 20),
  faisabilite INTEGER CHECK (faisabilite BETWEEN 0 AND 15),
  competences_techniques INTEGER CHECK (competences_techniques BETWEEN 0 AND 10),
  coherence_profil INTEGER CHECK (coherence_profil BETWEEN 0 AND 10),
  -- Score total calculé
  score_total INTEGER GENERATED ALWAYS AS (
    COALESCE(qualite_projet,0) +
    COALESCE(motivation,0) +
    COALESCE(clarte_problematique,0) +
    COALESCE(faisabilite,0) +
    COALESCE(competences_techniques,0) +
    COALESCE(coherence_profil,0)
  ) STORED,
  soumis BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(comite_id, equipe_id)
);

-- Vue classement général avec bonus équipe calculés automatiquement
CREATE OR REPLACE VIEW vue_classement_selection AS
SELECT
  e.id,
  e.nom_equipe,
  e.type_candidature,
  e.statut,
  COUNT(DISTINCT n.comite_id) as nb_evaluateurs,
  ROUND(AVG(n.score_total), 2) as score_moyen,
  -- Bonus équipe calculés automatiquement
  CASE
    WHEN e.type_candidature = 'equipe' THEN (
      -- Diversité des profils : +10 si >= 3 rôles différents
      CASE WHEN (
        SELECT COUNT(DISTINCT role_equipe)
        FROM membres WHERE equipe_id = e.id AND role_equipe IS NOT NULL
      ) >= 3 THEN 10 ELSE 0 END
      +
      -- Complémentarité : +5 si >= 3 compétences différentes
      CASE WHEN (
        SELECT COUNT(DISTINCT unnest(competences))
        FROM membres WHERE equipe_id = e.id
      ) >= 3 THEN 5 ELSE 0 END
      +
      -- Parité : +5 si au moins 1 femme
      CASE WHEN EXISTS (
        SELECT 1 FROM membres
          WHERE equipe_id = e.id AND genre = 'femme'
      ) THEN 5 ELSE 0 END
    )
    ELSE 0
  END as bonus_equipe,
  -- Score final = moyenne + bonus
  ROUND(AVG(n.score_total), 2) + (
    CASE
      WHEN e.type_candidature = 'equipe' THEN (
        CASE WHEN (SELECT COUNT(DISTINCT role_equipe) FROM membres WHERE equipe_id = e.id AND role_equipe IS NOT NULL) >= 3 THEN 10 ELSE 0 END
        + CASE WHEN (SELECT COUNT(DISTINCT unnest(competences)) FROM membres WHERE equipe_id = e.id) >= 3 THEN 5 ELSE 0 END
        + CASE WHEN EXISTS (SELECT 1 FROM membres WHERE equipe_id = e.id AND genre = 'femme') THEN 5 ELSE 0 END
      )
      ELSE 0
    END
  ) as score_final
FROM equipes e
LEFT JOIN notes n ON n.equipe_id = e.id AND n.soumis = true
GROUP BY e.id
ORDER BY score_final DESC NULLS LAST;

-- Champ pour contrôler la publication publique des équipes
ALTER TABLE equipes ADD COLUMN IF NOT EXISTS publiee BOOLEAN DEFAULT false;

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_notes_equipe_id ON notes(equipe_id);
CREATE INDEX IF NOT EXISTS idx_notes_comite_id ON notes(comite_id);
CREATE INDEX IF NOT EXISTS idx_assignments_comite_id ON assignments(comite_id);
CREATE INDEX IF NOT EXISTS idx_assignments_equipe_id ON assignments(equipe_id);
CREATE INDEX IF NOT EXISTS idx_equipes_statut ON equipes(statut);
CREATE INDEX IF NOT EXISTS idx_equipes_publiee ON equipes(publiee);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON notes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
