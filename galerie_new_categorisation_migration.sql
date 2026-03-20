-- Migration pour restructurer les catégories de la galerie
-- Structure: Année (2025, 2026, etc.) puis Type (TEAM ISOC ESMT, Mentors, Jury, Equipes, Partenaires)

-- 1. Ajout des nouvelles colonnes pour la double classification
ALTER TABLE galerie 
ADD COLUMN annee INTEGER DEFAULT 2026,
ADD COLUMN type_categorie TEXT DEFAULT 'general' CHECK (type_categorie IN ('team_isoc_esmt', 'mentors', 'jury', 'equipes', 'partenaires', 'general'));

-- 2. Création des index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_galerie_annee ON galerie(annee);
CREATE INDEX IF NOT EXISTS idx_galerie_type_categorie ON galerie(type_categorie);
CREATE INDEX IF NOT EXISTS idx_galerie_annee_type ON galerie(annee, type_categorie);

-- 3. Migration des données existantes
-- Mise à jour basée sur l'ancienne catégorie
UPDATE galerie SET 
    annee = 2026,
    type_categorie = CASE 
        WHEN categorie IN ('equipes', 'general') THEN 'equipes'
        WHEN categorie = 'mentors' THEN 'mentors' 
        WHEN categorie = 'partenaires' THEN 'partenaires'
        WHEN categorie = 'ceremonie' THEN 'jury'
        ELSE 'team_isoc_esmt'
    END
WHERE annee IS NULL;

-- 4. Suppression de l'ancienne colonne catégorie (optionnel - à décommenter si sûr)
-- ALTER TABLE galerie DROP COLUMN categorie;

-- 5. Insertion d'années possibles dans une table de référence (optionnel)
CREATE TABLE IF NOT EXISTS galerie_annees (
    id SERIAL PRIMARY KEY,
    annee INTEGER UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des années de référence
INSERT INTO galerie_annees (annee) VALUES 
    (2025),
    (2026),
    (2027),
    (2028)
ON CONFLICT (annee) DO NOTHING;

-- 6. Vue pour faciliter les requêtes avec libellés
CREATE OR REPLACE VIEW galerie_with_labels AS
SELECT 
    g.*,
    ga.annee as annee_label,
    CASE 
        WHEN g.type_categorie = 'team_isoc_esmt' THEN 'TEAM ISOC ESMT'
        WHEN g.type_categorie = 'mentors' THEN 'Mentors'
        WHEN g.type_categorie = 'jury' THEN 'Jury'
        WHEN g.type_categorie = 'equipes' THEN 'Équipes'
        WHEN g.type_categorie = 'partenaires' THEN 'Partenaires'
        ELSE 'Général'
    END as type_categorie_label
FROM galerie g
LEFT JOIN galerie_annees ga ON g.annee = ga.annee;
