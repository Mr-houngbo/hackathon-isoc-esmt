-- Create enum types
CREATE TYPE public.type_candidature AS ENUM ('individuel', 'equipe');
CREATE TYPE public.type_projet AS ENUM ('oui', 'non', 'en_reflexion');
CREATE TYPE public.type_avancement AS ENUM ('concept', 'esquisse', 'prototype');
CREATE TYPE public.type_niveau AS ENUM ('debutant', 'intermediaire', 'avance');
CREATE TYPE public.type_genre AS ENUM ('homme', 'femme', 'non_precise');
CREATE TYPE public.type_niveau_etudes AS ENUM ('L1', 'L2', 'L3', 'M1', 'M2');
CREATE TYPE public.type_mentor AS ENUM ('mentor', 'jury');
CREATE TYPE public.type_partenaire AS ENUM ('or', 'argent', 'bronze');
CREATE TYPE public.type_certificat AS ENUM ('participation', 'laureat');

-- Table equipes
CREATE TABLE public.equipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type_candidature text CHECK (type_candidature IN ('individuel', 'equipe')) NOT NULL,
  nom_equipe TEXT,
  nombre_membres INTEGER CHECK (nombre_membres BETWEEN 1 AND 4),
  a_projet text CHECK (a_projet IN ('oui', 'non', 'en_reflexion')),
  nom_projet TEXT,
  domaine_projet TEXT,
  problematique TEXT,
  solution TEXT,
  technologies TEXT,
  niveau_avancement text CHECK (niveau_avancement IN ('concept', 'esquisse', 'prototype')),
  contraintes_techniques TEXT,
  niveau_technique text CHECK (niveau_technique IN ('debutant', 'intermediaire', 'avance')),
  competences_equipe TEXT[],
  handle_instagram TEXT,
  handle_linkedin TEXT,
  motivation TEXT,
  esperances TEXT,
  source_info TEXT,
  selectionnee BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.equipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert equipes" ON public.equipes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read selected equipes" ON public.equipes FOR SELECT TO anon, authenticated USING (selectionnee = true);
CREATE POLICY "Authenticated can update equipes" ON public.equipes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete equipes" ON public.equipes FOR DELETE TO authenticated USING (true);

-- Table membres
CREATE TABLE public.membres (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipe_id UUID REFERENCES public.equipes(id) ON DELETE CASCADE,
  est_chef BOOLEAN DEFAULT false,
  nom_prenom TEXT NOT NULL,
  genre text CHECK (genre IN ('homme', 'femme', 'non_precise')),
  filiere TEXT NOT NULL,
  niveau_etudes text CHECK (niveau_etudes IN ('L1','L2','L3','M1','M2')),
  telephone TEXT,
  email TEXT NOT NULL,
  etablissement TEXT,
  competences TEXT[],
  role_equipe TEXT,
  disponible_2_jours BOOLEAN NOT NULL DEFAULT true,
  accepte_conditions BOOLEAN,
  autorise_photos BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.membres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert membres" ON public.membres FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read membres" ON public.membres FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can update membres" ON public.membres FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete membres" ON public.membres FOR DELETE TO authenticated USING (true);

-- Table mentors
CREATE TABLE public.mentors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  titre TEXT,
  entreprise TEXT,
  photo_url TEXT,
  type text CHECK (type IN ('mentor', 'jury')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read mentors" ON public.mentors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert mentors" ON public.mentors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update mentors" ON public.mentors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete mentors" ON public.mentors FOR DELETE TO authenticated USING (true);

-- Table agenda
CREATE TABLE public.agenda (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jour INTEGER CHECK (jour IN (1, 2)),
  heure_debut TEXT NOT NULL,
  heure_fin TEXT,
  titre TEXT NOT NULL,
  description TEXT,
  lieu TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read agenda" ON public.agenda FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert agenda" ON public.agenda FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update agenda" ON public.agenda FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete agenda" ON public.agenda FOR DELETE TO authenticated USING (true);

-- Table partenaires
CREATE TABLE public.partenaires (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  logo_url TEXT,
  niveau text CHECK (niveau IN ('or', 'argent', 'bronze')),
  site_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.partenaires ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read partenaires" ON public.partenaires FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert partenaires" ON public.partenaires FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update partenaires" ON public.partenaires FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete partenaires" ON public.partenaires FOR DELETE TO authenticated USING (true);

-- Table galerie
CREATE TABLE public.galerie (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipe_id UUID REFERENCES public.equipes(id),
  titre_projet TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.galerie ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read galerie" ON public.galerie FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert galerie" ON public.galerie FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update galerie" ON public.galerie FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete galerie" ON public.galerie FOR DELETE TO authenticated USING (true);

-- Table annonces
CREATE TABLE public.annonces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  contenu TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.annonces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read annonces" ON public.annonces FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert annonces" ON public.annonces FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update annonces" ON public.annonces FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete annonces" ON public.annonces FOR DELETE TO authenticated USING (true);

-- Table retours
CREATE TABLE public.retours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  membre_id UUID REFERENCES public.membres(id),
  note_globale INTEGER CHECK (note_globale BETWEEN 1 AND 5),
  commentaire TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.retours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert retours" ON public.retours FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can read retours" ON public.retours FOR SELECT TO authenticated USING (true);

-- Table badges
CREATE TABLE public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  membre_id UUID REFERENCES public.membres(id) ON DELETE CASCADE,
  equipe_id UUID REFERENCES public.equipes(id) ON DELETE CASCADE,
  qr_code_url TEXT,
  envoye BOOLEAN DEFAULT false,
  date_envoi TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can manage badges" ON public.badges FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table certificats
CREATE TABLE public.certificats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  membre_id UUID REFERENCES public.membres(id) ON DELETE CASCADE,
  equipe_id UUID REFERENCES public.equipes(id) ON DELETE CASCADE,
  type text CHECK (type IN ('participation', 'laureat')),
  rang INTEGER,
  qr_code_url TEXT,
  envoye BOOLEAN DEFAULT false,
  date_envoi TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.certificats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can manage certificats" ON public.certificats FOR ALL TO authenticated USING (true) WITH CHECK (true);