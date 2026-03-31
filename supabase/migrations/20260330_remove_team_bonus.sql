-- Migration pour supprimer les bonus automatiques des équipes
-- Date: 30 Mars 2026

-- Supprimer l'ancienne vue et la recréer sans les bonus
DROP VIEW IF EXISTS vue_classement_selection;

-- Nouvelle vue sans bonus équipe
CREATE OR REPLACE VIEW vue_classement_selection AS
SELECT
  e.id,
  e.nom_equipe,
  e.type_candidature,
  e.statut,
  e.publiee,
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

COMMENT ON VIEW vue_classement_selection IS 'Classement général sans bonus automatiques - tous les candidats sont évalués sur les mêmes critères';
