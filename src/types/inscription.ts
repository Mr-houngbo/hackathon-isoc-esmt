export interface InscriptionData {
  // Step 1
  accepte_conditions: boolean;
  autorise_photos: boolean;

  // Step 2
  type_candidature: 'individuel' | 'equipe';
  nom_equipe: string;
  nombre_membres: number; // automatique : 1 si individuel, 4 si equipe

  // Step 3 — Chef
  chef: {
    nom_prenom: string;
    genre: 'homme' | 'femme' | ''; // obligatoire
    filiere: string;
    niveau_etudes: 'L1' | 'L2' | 'L3' | 'M1' | 'M2' | '';
    telephone: string;
    email: string;
    etablissement: string;
    competences: string[]; // tableau de strings
    competence_autre: string; // si 'Autre' coché
    disponible_2_jours: boolean | null; // true | false
  };

  // Step 4 — Membres (toujours 3 blocs si equipe)
  membres: {
    nom_prenom: string;
    genre: 'homme' | 'femme' | '';
    filiere: string;
    niveau_etudes: 'L1' | 'L2' | 'L3' | 'M1' | 'M2' | '';
    role_equipe: 'Dev' | 'Design' | 'Business' | 'Communication' | 'Autre' | '';
    telephone: string;
    email: string;
    etablissement: string;
    competences: string[];
    competence_autre: string;
    disponible_2_jours: boolean | null;
  }[];

  // Step 5 — Projet
  a_projet: 'oui' | 'non' | '';
  nom_projet: string;
  domaine_projet: string;
  problematique: string;
  solution: string;

  // Step 6 — Profil
  niveau_technique: 'debutant' | 'intermediaire' | 'avance' | '';

  // Step 7 — Motivation
  motivation: string;
  esperances: string;
  source_info: string; // obligatoire

  // Additional fields for selected teams
  position?: number;
  selectionnee?: boolean;
}

export const defaultInscriptionData: InscriptionData = {
  accepte_conditions: false,
  autorise_photos: false,
  type_candidature: 'individuel',
  nom_equipe: '',
  nombre_membres: 1,
  chef: {
    nom_prenom: '',
    genre: '',
    filiere: '',
    niveau_etudes: '',
    telephone: '',
    email: '',
    etablissement: 'ESMT',
    competences: [],
    competence_autre: '',
    disponible_2_jours: null,
  },
  membres: [],
  a_projet: '',
  nom_projet: '',
  domaine_projet: '',
  problematique: '',
  solution: '',
  niveau_technique: '',
  motivation: '',
  esperances: '',
  source_info: '',
  selectionnee: false,
};
