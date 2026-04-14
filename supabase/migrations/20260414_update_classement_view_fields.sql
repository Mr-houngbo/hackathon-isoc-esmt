-- Migration pour ajouter les champs manquants à la vue de classement
-- Date: 14 Avril 2026

-- Ajouter le champ position à la table equipes s'il n'existe pas
ALTER TABLE equipes ADD COLUMN IF NOT EXISTS position INTEGER;

-- Supprimer et recréer la vue avec tous les champs nécessaires
DROP VIEW IF EXISTS vue_classement_selection;

-- Nouvelle vue avec tous les champs pour l'affichage public
CREATE OR REPLACE VIEW vue_classement_selection AS
SELECT
  e.id,
  e.nom_equipe,
  e.type_candidature,
  e.statut,
  e.publiee,
  e.nom_projet,
  e.domaine_projet,
  e.problematique,
  e.position,
  e.a_projet,
  COUNT(DISTINCT n.comite_id) as nb_evaluateurs,
  COALESCE(ROUND(AVG(n.score_total), 2), 0) as score_moyen,
  -- Bonus équipe désactivés (toujours 0)
  0 as bonus_equipe,
  -- Score final = moyenne uniquement (sans bonus) - 0 si pas de notes
  COALESCE(ROUND(AVG(n.score_total), 2), 0) as score_final
FROM equipes e
LEFT JOIN notes n ON n.equipe_id = e.id AND n.soumis = true
GROUP BY e.id
ORDER BY score_final DESC NULLS LAST;

COMMENT ON VIEW vue_classement_selection IS 'Classement général avec tous les champs pour affichage public - scores sans bonus';
