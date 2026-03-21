-- Correction de la vue de classement pour que les équipes non évaluées aient un score moyen de 0
-- Au lieu de NULL qui cause des problèmes de tri

CREATE OR REPLACE VIEW vue_classement_selection AS
SELECT
  e.id,
  e.nom_equipe,
  e.type_candidature,
  e.statut,
  COUNT(DISTINCT n.comite_id) as nb_evaluateurs,
  -- Score moyen : 0 si pas de notes, sinon la moyenne réelle
  COALESCE(ROUND(AVG(n.score_total), 2), 0) as score_moyen,
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
  -- Score final = moyenne + bonus (avec moyenne = 0 si non évalué)
  COALESCE(ROUND(AVG(n.score_total), 2), 0) + (
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
ORDER BY score_final DESC;
