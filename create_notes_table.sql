-- Script de vérification et création de la table notes
-- À exécuter dans la console SQL Supabase si la table n'existe pas

-- Vérifier si la table notes existe
SELECT EXISTS (
   SELECT FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename = 'notes'
);

-- Si la table n'existe pas, créer la table complète
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comite_id UUID NOT NULL,
  equipe_id UUID NOT NULL,
  -- Critères de notation
  qualite_projet INTEGER CHECK (qualite_projet BETWEEN 0 AND 25),
  motivation INTEGER CHECK (motivation BETWEEN 0 AND 20),
  clarte_problematique INTEGER CHECK (clarte_problematique BETWEEN 0 AND 20),
  faisabilite INTEGER CHECK (faisabilite BETWEEN 0 AND 15),
  competences_techniques INTEGER CHECK (competences_techniques BETWEEN 0 AND 10),
  coherence_profil INTEGER CHECK (coherence_profil BETWEEN 0 AND 10),
  -- Score total calculé automatiquement
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

-- Créer les index si n'existent pas
CREATE INDEX IF NOT EXISTS idx_notes_equipe_id ON notes(equipe_id);
CREATE INDEX IF NOT EXISTS idx_notes_comite_id ON notes(comite_id);

-- Créer le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON notes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Donner les permissions nécessaires
GRANT ALL ON notes TO anon;
GRANT ALL ON notes TO authenticated;

-- Vérifier la création
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'notes' 
AND table_schema = 'public'
ORDER BY ordinal_position;
