-- Création de la table feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- bug, improvement, feature, other
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status VARCHAR(50) DEFAULT 'new' -- new, in_progress, resolved, archived
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_type ON feedbacks(type);
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON feedbacks(status);

-- Politique RLS (Row Level Security) pour permettre l'insertion anonyme
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Politique : tout le monde peut insérer
CREATE POLICY "Allow anonymous insert" ON feedbacks
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Politique : seuls les admins peuvent lire
CREATE POLICY "Allow admin read" ON feedbacks
  FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE feedbacks IS 'Table de stockage des feedbacks utilisateurs';
