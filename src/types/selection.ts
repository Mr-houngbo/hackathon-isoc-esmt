export interface NoteData {
  qualite_projet: number | null;
  motivation: number | null;
  clarte_problematique: number | null;
  faisabilite: number | null;
  competences_techniques: number | null;
  coherence_profil: number | null;
}

export interface Equipe {
  id: string;
  nom_equipe: string;
  type_candidature: string;
  statut: string;
  nom_projet?: string;
  problematique?: string;
  solution?: string;
  niveau_technique?: string;
  motivation?: string;
  publiee?: boolean;
  membres?: Array<{
    nom_prenom: string;
    filiere: string;
    niveau_etudes: string;
    role_equipe: string;
    competences: string[];
    genre: string;
  }>;
}

export interface Assignment {
  id: string;
  equipe_id: string;
  equipe: Equipe;
}

