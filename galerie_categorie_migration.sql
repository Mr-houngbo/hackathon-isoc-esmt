-- Ajout d'un champ de catégorie pour la galerie
-- Permettra de classer les images par : année dernière, cette année, équipes, etc.

ALTER TABLE galerie 
ADD COLUMN categorie TEXT DEFAULT 'general' CHECK (categorie IN ('general', 'annee_derniere', 'cette_annee', 'equipes', 'mentors', 'partenaires', 'ceremonie'));

-- Création d'un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_galerie_categorie ON galerie(categorie);

-- Mise à jour des données existantes (optionnel)
-- UPDATE galerie SET categorie = 'general' WHERE categorie IS NULL;
