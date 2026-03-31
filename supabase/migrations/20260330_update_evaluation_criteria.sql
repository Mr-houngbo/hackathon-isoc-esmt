-- Migration : Mise à jour des critères d'évaluation
-- Date : 2026-03-30
-- Ordre important : Supprimer d'abord la vue, puis score_total, puis les colonnes obsolètes

-- Étape 1 : Supprimer la vue qui dépend de score_total
DROP VIEW IF EXISTS vue_classement_selection;

-- Étape 2 : Supprimer score_total qui dépend des colonnes à supprimer
ALTER TABLE notes DROP COLUMN IF EXISTS score_total;

-- Étape 3 : Supprimer les colonnes obsolètes (plus de dépendances)
ALTER TABLE notes DROP COLUMN IF EXISTS faisabilite;
ALTER TABLE notes DROP COLUMN IF EXISTS coherence_profil;

-- Étape 4 : Supprimer les anciennes contraintes check
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_clarte_problematique_check;
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_competence_manageriale_check;
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_appartenance_esmt_check;

-- Étape 5 : Modifier clarte_problematique (max 15 au lieu de 20)
ALTER TABLE notes ADD CONSTRAINT notes_clarte_problematique_check 
  CHECK (clarte_problematique >= 0 AND clarte_problematique <= 15);

-- Étape 6 : Ajouter les nouvelles colonnes
ALTER TABLE notes ADD COLUMN IF NOT EXISTS presence_feminine integer 
  CHECK (presence_feminine >= 0 AND presence_feminine <= 5);
  
ALTER TABLE notes ADD COLUMN IF NOT EXISTS pluridisciplinarite integer 
  CHECK (pluridisciplinarite >= 0 AND pluridisciplinarite <= 10);

-- Étape 7 : Ajouter les contraintes sur les colonnes existantes
ALTER TABLE notes ADD CONSTRAINT notes_competence_manageriale_check 
  CHECK (competence_manageriale >= 0 AND competence_manageriale <= 10);
  
ALTER TABLE notes ADD CONSTRAINT notes_appartenance_esmt_check 
  CHECK (appartenance_esmt >= 0 AND appartenance_esmt <= 5);

-- Étape 8 : Recréer score_total avec la nouvelle formule
-- Nouvelle formule : qualite_projet(25) + motivation(20) + clarte_problematique(15) + competences_techniques(10) + competence_manageriale(10) + appartenance_esmt(5) + presence_feminine(5) + pluridisciplinarite(10) = 100 points
ALTER TABLE notes ADD COLUMN score_total integer GENERATED ALWAYS AS (
  COALESCE(qualite_projet, 0) + 
  COALESCE(motivation, 0) + 
  COALESCE(clarte_problematique, 0) + 
  COALESCE(competences_techniques, 0) + 
  COALESCE(competence_manageriale, 0) + 
  COALESCE(appartenance_esmt, 0) + 
  COALESCE(presence_feminine, 0) + 
  COALESCE(pluridisciplinarite, 0)
) STORED;

-- Étape 9 : Recréer la vue vue_classement_selection
CREATE OR REPLACE VIEW vue_classement_selection AS
SELECT
  e.id,
  e.nom_equipe,
  e.type_candidature,
  e.statut,
  COUNT(DISTINCT n.comite_id) as nb_evaluateurs,
  COALESCE(ROUND(AVG(n.score_total), 2), 0) as score_moyen,
  COALESCE(ROUND(AVG(n.score_total), 2), 0) as score_final
FROM equipes e
LEFT JOIN notes n ON n.equipe_id = e.id AND n.soumis = true
GROUP BY e.id
ORDER BY score_final DESC NULLS LAST;
