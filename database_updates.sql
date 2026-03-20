-- ========================================
-- MISES À JOUR DE LA BASE DE DONNÉES POUR LES BADGES
-- ========================================

-- Exécuter ces requêtes dans Supabase SQL Editor
-- Avant d'utiliser le système de badges

-- 1. Ajouter les colonnes manquantes à la table badges
ALTER TABLE badges 
ADD COLUMN IF NOT EXISTS staff_info JSONB;

ALTER TABLE badges 
ADD COLUMN IF NOT EXISTS type TEXT 
CHECK (type IN ('participant', 'staff'))
DEFAULT 'participant';

-- 2. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(type);
CREATE INDEX IF NOT EXISTS idx_badges_membre_id ON badges(membre_id);
CREATE INDEX IF NOT EXISTS idx_badges_equipe_id ON badges(equipe_id);

-- 3. Mettre à jour les badges existants pour s'assurer qu'ils ont le bon type
UPDATE badges 
SET type = 'participant' 
WHERE type IS NULL;

-- 4. (Optionnel) Nettoyer les badges orphelins si nécessaire
-- DELETE FROM badges WHERE membre_id IS NULL AND staff_info IS NULL;

-- ========================================
-- VÉRIFICATION DE LA STRUCTURE
-- ========================================

-- Pour vérifier que tout est correct, exécutez :
-- \d badges

-- Pour voir les colonnes de la table badges :
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'badges';

-- ========================================
-- DONNÉES DE TEST (OPTIONNEL)
-- ========================================

-- Pour insérer un badge de test staff :
-- INSERT INTO badges (
--   id, 
--   membre_id, 
--   equipe_id, 
--   qr_code_url, 
--   envoye, 
--   type, 
--   staff_info
-- ) VALUES (
--   gen_random_uuid(),
--   NULL,
--   NULL,
--   'https://votre-site.com/verification/test-badge-id',
--   false,
--   'staff',
--   '{"nom_prenom": "Jean Dupont", "role": "Organisateur", "organisation": "ISOC ESMT"}'
-- );

-- ========================================
-- INSTRUCTIONS
-- ========================================

-- 1. Copiez-collez ces requêtes dans l'éditeur SQL Supabase
-- 2. Exécutez-les une par une ou en une seule fois
-- 3. Vérifiez qu'il n'y a pas d'erreurs
-- 4. Testez le système de badges

-- Note : Si vous avez déjà des badges dans la table,
-- la mise à jour du type ne devrait pas affecter les données existantes.
