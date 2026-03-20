-- Création des buckets de stockage pour les images
-- Ce script doit être exécuté dans la console Supabase SQL

-- Bucket principal pour tous les uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads', 
  'uploads', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Bucket spécifique pour les mentors
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mentors', 
  'mentors', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Bucket spécifique pour les partenaires
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'partenaires', 
  'partenaires', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Bucket pour la galerie
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'galerie', 
  'galerie', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Politiques d'accès publiques pour les uploads
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id IN ('uploads', 'mentors', 'partenaires', 'galerie'));

-- Politiques d'upload pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('uploads', 'mentors', 'partenaires', 'galerie') AND 
  auth.role() = 'authenticated'
);

-- Politiques de mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (
  bucket_id IN ('uploads', 'mentors', 'partenaires', 'galerie') AND 
  auth.role() = 'authenticated'
);

-- Politiques de suppression pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (
  bucket_id IN ('uploads', 'mentors', 'partenaires', 'galerie') AND 
  auth.role() = 'authenticated'
);
